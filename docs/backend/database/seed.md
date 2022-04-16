## Seeding

To test our database, we can seed the tables with (realistic) fake data, so that we can easily perform operations on it. The seeding service creates links, resources (with their profiles), clients, projects and assigns resources to projects, using faker.

The seeding service uses services in order to have better maintainence, as when some of our creation logic changes, the database script will not be affected. Additionally, before each run, the database is cleared (though it can specified to not) so there is a reset.

## Running Seed Scripts

Default: `npx nx run onboarding-api:seed` or `npm run seed`

Running the seed script without options, will create 3 clients, 6 projects and 10 resources (half assigned, half unassigned)

However, if you want to specifiy the number of values to create, you can specify the options as here:
`npx nx run onboarding-api:seed --clients=4 --projects=12 --resources=20`

This command will create 4 clients, 12 projects and 20 resources

If you want to prevent a clear of the database add the command `--clear =false`

## Accessing Seeded Data

In order to login with the user accounts created, the basic user account information (for the created accounts) is written to a CSV file, so the information is on hand so we can login as resources or business owners. The csv file can be found under the `utils/csv` directory with the file name `user-accounts.csv`

## Resources

The logic and handling for seeding was based off [this article](https://medium.com/the-crowdlinker-chronicle/seeding-databases-using-nestjs-cd6634e8efc5), and additionally the set up to run the script as a whole was through the [following issue](https://github.com/nrwl/nx/issues/1230).
