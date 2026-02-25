# environments/

Environment-specific Helm value overrides.
Structure: environments/<env>/values.yaml
These files are the ONLY place where env differences should live.
Never hardcode env-specific config in charts/.
