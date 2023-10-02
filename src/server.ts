import { app } from './app'
import { env } from './env'

try {
    void app.listen({ port: env.PORT })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}
