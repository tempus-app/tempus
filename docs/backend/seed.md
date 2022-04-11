## Seeding

To test our database, we can seed the tables with (realistic) fake data, so that we can easily perform operations on it. The seeding service creates links, resources (with their profiles), clients, projects and assigns resources to projects, using faker. 

The seeding service uses services in order to have better maintainence, as when some of our creation logic changes, the database script will not be affected. Additionally, before each run, the database is cleared (though it can specified to not) so there is a reset.


## Running Seed Scripts

Default: `npx nx run api-shared-feature-seed:run` or `npm run seed`

Running the seed script without options, will create 3 clients, 6 projects and 10 resources (half assigned, half unassigned)

However, if you want to specifiy the number of values to create, you can specify the options as here:
 `npx nx run api-shared-feature-seed:run --clients=4 --projects=12 --resources=20`

 This command will create 4 clients, 12 projects and 20 resources

 If you want to prevent a clear of the database add the command `--clear =false` 

