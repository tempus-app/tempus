# Migrations

In order to properly version our database, support for migrations has been added. This allows you to track the changes to the database, and revert if need be. Migrations has been supported through TypeORM, the ORM used for development in NestJs.

## Steps to Running Migrations

## Generating a Migration File

First, make the changes you would like in the entity models within the database, see [database.md](./../database.md) to understand more about the database structure.

After your changes have been made, run the command `npx nx run onboarding-api:migration-generate --n="{Migration Name}"` to generate a migration file. Please make sure to name the migration through the command `-n`, and ensure it is descriptive of the changes that were made to the entites (it's important to keep the changes small and grouped!). This should auto generate a migration file within the `migrations/` folder.

There are cases where typeorm will not be able to detect changes, for example, if you remove an entity within the database that is not used anywhere, it will not be recognized. So, in this case you can create an empty migration file using the command `npx nx run onboarding-api:migration-create --n="{Migration Name}"`. The migration file should look like the following:

```js
import {MigrationInterface, QueryRunner} from "typeorm";

export class <Migration Name><TimeStamp> implements MigrationInterface {

     public async up(queryRunner: QueryRunner): Promise<void> {

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }
}

```

You must now fill out the up method (when migration is run) and the down method (if migration is reverted) manually.

## Running a Migration File

The database configurations have been set to run the migrations on build, so this step would be auto run when the api starts to run. However, if you would like to run the migration file separately run, `npx nx run onboarding-api:migration-run`. This will build the migrations onto the dist/ folder, and then run the migration and update the database (below is a CLI result of a successful migration run).

```
query: SELECT * FROM current_schema()
query: SHOW server_version;
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'migrations'
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'typeorm_metadata'
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
2 migrations are already loaded in the database.
3 migrations were found in the source code.
AddConstraints1649979564715 is the last executed migration. It was executed on Thu Apr 14 2022 19:39:24 GMT-0400 (Eastern Daylight Time).
1 migrations are new migrations that needs to be executed.
query: START TRANSACTION
query: DROP TABLE "task_entity"
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1649981562381,"RemoveTask1649981562381"]
Migration RemoveTask1649981562381 has been executed successfully.
query: COMMIT
```

Important note: The `dist/migrations` folder is not self maintaining. The build command only copies over new files into the dist/migrations directory. This can be problematic in cases where you accidentally generate a bad migration file. If this is the case, make sure to remove this file in both the `migrations/` and the `dist/migrations` folder, otherwise the run command will have issues.

## Reverting a Migration

There are cases when a migration revert is needed, to revert a migration simply run `npx nx run onboarding-api:migration-revert`, and this will revert the latest migration.

## Resources

The following [resource](https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f) were used to help develop migrations.
