/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude supabase functions from webpack processing
    config.module.rules.push({
      test: /supabase[/\\]functions/,
      use: 'null-loader'
    })
    return config
  },
  outputFileTracingExcludes: {
    '*': ['supabase/functions/**/*'],
  },
}

module.exports = nextConfig