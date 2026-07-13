Read `AGENTS.md` before starting.

We want to implement the pet profile page that the owner can open to view his pets stats and info and scan history of that specific pet.

When the user clicks on the pet in the pet section in the dashboard it should route him to the pet profile page of that pet.

The URL should look like `/pets/[pet_id]`

Only the owner of that pet can access the pets profile page. If some one else tries to access the page by typing manually in the url bar show a 404 page not found.

- The pet profile page should include:

1. The image of the pet that the owner uploads and is found in the database and if there is no pet image in database just as a placeholder allow the user to uplaod an image of his pet and store it in the database row of that pet.
2. The pet's information: name, species, breed, age, weight.
3. The pet's latest scan report like that of dashboard health insight but specific to that pet.
4. The pet's scan history like that of dashboard but specific to that pet.
5. The tasks that are suggested for the pet and events like that of dashboard but specific to that pet.
6. Scan your button.

- The page's elements should be organized in a grid pattern and for the scan history section and pet events sections lets add scroll functionallity just in case of alot of scan to show and/or tasks and events it would stretch down fro a fair amount and then the user would start to scroll not desrupting page organization.
- Follow the website theme in `ui-context.md`

### Check when done
- Compilation succeeds.
- Section is fully responsive (collapses to mobile menu) and landing page shouldn't be affected.
- Styling is applied correctly via CSS tokens.