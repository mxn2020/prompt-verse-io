-- Initial schema for Prompt-Verse application
-- This migration creates the core tables for the prompt engineering platform

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE prompt_type AS ENUM ('standard', 'structured', 'modularized', 'advanced');
CREATE TYPE visibility_type AS ENUM ('private', 'team', 'public');
CREATE TYPE flow_status AS ENUM ('draft', 'active', 'paused', 'archived');
CREATE TYPE agent_status AS ENUM ('inactive', 'active', 'paused', 'error');

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name text,
    avatar_url text,
    role text DEFAULT 'user',
    plan_tier text DEFAULT 'free',
    team_id uuid,
    preferences jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    settings jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Team memberships
CREATE TABLE IF NOT EXISTS team_memberships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role text DEFAULT 'member',
    joined_at timestamp with time zone DEFAULT now(),
    UNIQUE(team_id, user_id)
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
    visibility visibility_type DEFAULT 'private',
    settings jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Modules table (reusable prompt components)
CREATE TABLE IF NOT EXISTS modules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    content text NOT NULL,
    variables jsonb DEFAULT '[]',
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    visibility visibility_type DEFAULT 'private',
    tags text[] DEFAULT '{}',
    usage_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Blocks table (smaller reusable components)
CREATE TABLE IF NOT EXISTS blocks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    content text NOT NULL,
    block_type text DEFAULT 'text',
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    visibility visibility_type DEFAULT 'private',
    tags text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Wrappers table (prompt formatting templates)
CREATE TABLE IF NOT EXISTS wrappers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    template text NOT NULL,
    variables jsonb DEFAULT '[]',
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    visibility visibility_type DEFAULT 'private',
    tags text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    content text NOT NULL,
    prompt_type prompt_type DEFAULT 'standard',
    model_settings jsonb DEFAULT '{}',
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    visibility visibility_type DEFAULT 'private',
    tags text[] DEFAULT '{}',
    starred boolean DEFAULT false,
    usage_count integer DEFAULT 0,
    version integer DEFAULT 1,
    parent_id uuid REFERENCES prompts(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Prompt modules relationship (for modularized prompts)
CREATE TABLE IF NOT EXISTS prompt_modules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    position integer NOT NULL,
    variables jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Flows table (prompt sequences)
CREATE TABLE IF NOT EXISTS flows (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    status flow_status DEFAULT 'draft',
    settings jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Flow steps table
CREATE TABLE IF NOT EXISTS flow_steps (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE NOT NULL,
    prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
    position integer NOT NULL,
    conditions jsonb DEFAULT '{}',
    settings jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Agents table (autonomous prompt execution)
CREATE TABLE IF NOT EXISTS agents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    status agent_status DEFAULT 'inactive',
    schedule jsonb DEFAULT '{}',
    webhook_url text,
    settings jsonb DEFAULT '{}',
    last_run_at timestamp with time zone,
    next_run_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT agent_must_have_flow_or_prompt CHECK (
        (flow_id IS NOT NULL AND prompt_id IS NULL) OR 
        (flow_id IS NULL AND prompt_id IS NOT NULL)
    )
);

-- Model patterns table
CREATE TABLE IF NOT EXISTS model_patterns (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    model_name text NOT NULL,
    settings jsonb NOT NULL,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
    visibility visibility_type DEFAULT 'private',
    tags text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Execution logs table
CREATE TABLE IF NOT EXISTS execution_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id uuid REFERENCES prompts(id) ON DELETE SET NULL,
    flow_id uuid REFERENCES flows(id) ON DELETE SET NULL,
    agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    input_data jsonb,
    output_data jsonb,
    model_settings jsonb,
    execution_time_ms integer,
    tokens_used integer,
    cost numeric(10,6),
    status text,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);

-- Comments table (for collaboration)
CREATE TABLE IF NOT EXISTS comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    content text NOT NULL,
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
    flow_id uuid REFERENCES flows(id) ON DELETE CASCADE,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT comment_must_have_target CHECK (
        (prompt_id IS NOT NULL AND flow_id IS NULL AND module_id IS NULL) OR
        (prompt_id IS NULL AND flow_id IS NOT NULL AND module_id IS NULL) OR
        (prompt_id IS NULL AND flow_id IS NULL AND module_id IS NOT NULL)
    )
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- User profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Teams: members can view, owners can manage
CREATE POLICY "Team members can view team" ON teams FOR SELECT USING (
    id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
);
CREATE POLICY "Team owners can manage team" ON teams FOR ALL USING (owner_id = auth.uid());

-- Team memberships: members can view, owners can manage
CREATE POLICY "Team members can view memberships" ON team_memberships FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_memberships WHERE user_id = auth.uid())
);
CREATE POLICY "Team owners can manage memberships" ON team_memberships FOR ALL USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
);

-- Workspaces: owners and team members can access based on visibility
CREATE POLICY "Workspace access policy" ON workspaces FOR SELECT USING (
    owner_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'team' AND team_id IN (
        SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
    ))
);
CREATE POLICY "Workspace owners can manage" ON workspaces FOR ALL USING (owner_id = auth.uid());

-- Modules: access based on visibility and ownership
CREATE POLICY "Module access policy" ON modules FOR SELECT USING (
    owner_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'team' AND workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    ))
);
CREATE POLICY "Module owners can manage" ON modules FOR ALL USING (owner_id = auth.uid());

-- Similar policies for other tables
CREATE POLICY "Block access policy" ON blocks FOR SELECT USING (
    owner_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'team' AND workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    ))
);
CREATE POLICY "Block owners can manage" ON blocks FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Wrapper access policy" ON wrappers FOR SELECT USING (
    owner_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'team' AND workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    ))
);
CREATE POLICY "Wrapper owners can manage" ON wrappers FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Prompt access policy" ON prompts FOR SELECT USING (
    owner_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'team' AND workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    ))
);
CREATE POLICY "Prompt owners can manage" ON prompts FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Flow access policy" ON flows FOR SELECT USING (
    owner_id = auth.uid() OR
    workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    )
);
CREATE POLICY "Flow owners can manage" ON flows FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Agent access policy" ON agents FOR SELECT USING (
    owner_id = auth.uid() OR
    workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    )
);
CREATE POLICY "Agent owners can manage" ON agents FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Model pattern access policy" ON model_patterns FOR SELECT USING (
    owner_id = auth.uid() OR
    visibility = 'public' OR
    (visibility = 'team' AND workspace_id IN (
        SELECT id FROM workspaces WHERE team_id IN (
            SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
        )
    ))
);
CREATE POLICY "Model pattern owners can manage" ON model_patterns FOR ALL USING (owner_id = auth.uid());

-- Execution logs: users can view their own logs
CREATE POLICY "Users can view own execution logs" ON execution_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert execution logs" ON execution_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- Comments: users can view and create comments on accessible content
CREATE POLICY "Comment access policy" ON comments FOR SELECT USING (
    author_id = auth.uid() OR
    prompt_id IN (SELECT id FROM prompts WHERE owner_id = auth.uid() OR visibility = 'public') OR
    flow_id IN (SELECT id FROM flows WHERE owner_id = auth.uid()) OR
    module_id IN (SELECT id FROM modules WHERE owner_id = auth.uid() OR visibility = 'public')
);
CREATE POLICY "Users can manage own comments" ON comments FOR ALL USING (author_id = auth.uid());

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wrappers_updated_at BEFORE UPDATE ON wrappers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_model_patterns_updated_at BEFORE UPDATE ON model_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_prompts_owner_id ON prompts(owner_id);
CREATE INDEX idx_prompts_workspace_id ON prompts(workspace_id);
CREATE INDEX idx_prompts_updated_at ON prompts(updated_at DESC);
CREATE INDEX idx_prompts_starred ON prompts(starred) WHERE starred = true;
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);

CREATE INDEX idx_modules_owner_id ON modules(owner_id);
CREATE INDEX idx_modules_workspace_id ON modules(workspace_id);
CREATE INDEX idx_modules_tags ON modules USING GIN(tags);

CREATE INDEX idx_execution_logs_user_id ON execution_logs(user_id);
CREATE INDEX idx_execution_logs_created_at ON execution_logs(created_at DESC);
CREATE INDEX idx_execution_logs_prompt_id ON execution_logs(prompt_id);

CREATE INDEX idx_team_memberships_user_id ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON team_memberships(team_id);