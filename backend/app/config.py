from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "Closira Backend"
    app_env: str = "development"
    debug: bool = False
    database_url: str = "sqlite:///./closira.db"
    log_level: str = "INFO"


# Single shared instance — injected via FastAPI's Depends() rather than imported raw
# so tests can override settings without monkey-patching globals.
settings = Settings()
