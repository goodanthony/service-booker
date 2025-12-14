Local rebuild:

```bash
docker compose down -v
docker compose up --build
docker compose down --rmi local is scoped to the current Compose project.

Day to day use (no rebuild):
```
docker compose up
```