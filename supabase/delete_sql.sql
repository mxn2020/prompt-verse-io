-- Complete database cleanup migration for Supabase
-- This migration removes all existing tables, policies, functions, and types
-- WARNING: This will delete ALL data in your database. Use with caution!

-- Disable RLS temporarily to avoid policy conflicts during cleanup
SET row_security = off;

-- Drop all existing RLS policies
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies in the public schema
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            -- Continue if policy doesn't exist or can't be dropped
            NULL;
        END;
    END LOOP;
END
$$;

-- Drop all triggers first (to avoid dependency issues)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers
        WHERE trigger_schema = 'public'
        AND trigger_name LIKE '%updated_at%'
    ) LOOP
        BEGIN
            EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON ' || quote_ident(r.event_object_table) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END
$$;

-- Drop all functions related to the application
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_current_user_id() CASCADE;
DROP FUNCTION IF EXISTS auth.current_user_id() CASCADE;

-- Drop all tables in dependency order (child tables first)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS execution_logs CASCADE;
DROP TABLE IF EXISTS flow_steps CASCADE;
DROP TABLE IF EXISTS prompt_modules CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS flows CASCADE;
DROP TABLE IF EXISTS model_patterns CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS wrappers CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS team_memberships CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop all custom types (comprehensive cleanup)
DROP TYPE IF EXISTS agent_status CASCADE;
DROP TYPE IF EXISTS flow_status CASCADE;
DROP TYPE IF EXISTS visibility_type CASCADE;
DROP TYPE IF EXISTS prompt_type CASCADE;

-- Drop any other custom types that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT typname
        FROM pg_type t
        JOIN pg_namespace n ON t.typnamespace = n.oid
        WHERE n.nspname = 'public'
        AND t.typtype = 'e' -- Only ENUM types
        AND t.typname NOT LIKE 'pg_%' -- Exclude system types
    ) LOOP
        BEGIN
            EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
            RAISE NOTICE 'Dropped type: %', r.typname;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop type: % (Error: %)', r.typname, SQLERRM;
        END;
    END LOOP;
END
$$;

-- Drop all indexes that might remain
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%'
    ) LOOP
        BEGIN
            EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.indexname) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END
$$;

-- Clean up any remaining sequences that might have been created
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
        AND sequence_name NOT IN ('seq_schema_version') -- Keep Supabase's own sequences
    ) LOOP
        BEGIN
            EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END
$$;

-- Clean up any views that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT table_name
        FROM information_schema.views
        WHERE table_schema = 'public'
    ) LOOP
        BEGIN
            EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.table_name) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END
$$;

-- Re-enable RLS
SET row_security = on;

-- Verify cleanup completed
DO $$
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
    function_count INTEGER;
    type_count INTEGER;
BEGIN
    -- Count remaining application tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'user_profiles', 'teams', 'team_memberships', 'workspaces',
        'modules', 'blocks', 'wrappers', 'prompts', 'prompt_modules',
        'flows', 'flow_steps', 'agents', 'model_patterns',
        'execution_logs', 'comments'
    );

    -- Count remaining policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public';

    -- Count remaining custom functions
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN ('update_updated_at_column', 'get_current_user_id');

    -- Count remaining custom types (comprehensive check)
    SELECT COUNT(*) INTO type_count
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public'
    AND t.typtype = 'e' -- Only ENUM types
    AND t.typname NOT LIKE 'pg_%'; -- Exclude system types

    -- Report cleanup status
    RAISE NOTICE 'Cleanup completed:';
    RAISE NOTICE '- Application tables remaining: %', table_count;
    RAISE NOTICE '- RLS policies remaining: %', policy_count;
    RAISE NOTICE '- Custom functions remaining: %', function_count;
    RAISE NOTICE '- Custom types remaining: %', type_count;

    IF table_count = 0 AND policy_count = 0 AND function_count = 0 AND type_count = 0 THEN
        RAISE NOTICE 'Database cleanup successful! All application objects removed.';
    ELSE
        RAISE NOTICE 'Some objects may still remain. Check manually if needed.';
    END IF;
END
$$;