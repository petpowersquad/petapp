Read `AGENTS.md` before starting.

Now that we have a working database and the schema is `supabase/migrations/20260711183216_initial_schema.sql` and `supabase/migrations/20260713150131_add_storage_buckets.sql` we need to update the dashboard so that fetches data from the database supabase and remove all hardcoded examples from the dashboard.

Update `app/dashboard/page.tsx` so that it gets all the info from the database and clean the code from all hard coded examples.

- For the "Your Pets" section fetch the users pets fron the pets table in the database and if the user doesnt have any pets yet to show a add your first pet button. And only for this section dont implement a scroll bar but extend the section downwards to accomodate and make sure that the "Health Insights" section extends too even though that its empty just to maintain level with pets section.
- For the "Health Insights" and "Recent AI Scans" sections make sure that they have a nice looking ui to show that there info in these sections yet. If not add it with an empty icon. And incase where there alot of info to show and not to stretch the section and worsen the page representation add a scroll bar to the sections. 
- For the "Care Checklist":

1. Add functionality to the todo element since clicking the done icon does do anything. I want it to be initially undone icon then a complete icon when clicked.

2. Add a shadcn tab system to alternate between incomplete and completed tasks at the top of the section right above the todos below the secontion header with a full width of the section and small gaps at the edges not to touch the sections edges. when the user completes a task it disappears from the complete list and shows in the complete list and vice versa.

3. Update the both complete and imcomplete lists every week with new todos based on the database ofcourse.

4. If incase there is alot of tasks to do implememt a scroll bar not to stretch the section and worsen the ui page representation.

-Implement the add pet profile functionality:

1. it should show a pop up on top of the dashborad and not displacing any of the sections of the page.
2. it should use the same theme as the website and color scheme found in `ui-context.md`.
3. it should show a gray with very low opacity to diffrenciate the popup from the dashboard itself.
4. it should have a shadow.
5. it should have a option to either upload an image of the pet and the ai fills in all the information and a manual info input. If the user choses the AI image scan after the scan finishes and info is filled automatically in the same fields that the user would have filled himself and allow him to edit the info before submiting. And if the use uses AI scan and submits make sure to store the image in the database and as the photo of the pet in the database row of that pet.
6. try to fit the entire feilds without scrolling.
7. Note: don not implement anything related to the ai now just do the ui and the submit funtionalaty which adds the pet to the database.
8. if the pet profile was created succesfuly show a success message at the bottom right of the screen.
9. if an error happened show an error message showing the error in the bottom right corner of the screen.
10. When uplaoding an image only allow gpeg and png image files up to 5mb max and show a persecnatge bar showing uplaod process. Then show the image preview before scan.
11. After pet profile creation redirect to the scan page with the image that the user uploaded initially and if the user manually input the info redirect and the user will uplaod eventually. Do not implement the scan page funcionality and keep the hard coded stuff for now and just edit the fact that if the user uploaded an image to preview in the scan feild and if not to keep the ui same and the user will scan and upload.

### Check when done
- Compilation succeeds.
- Section is fully responsive (collapses to mobile menu) and landing page shouldn't be affected.
- Styling is applied correctly via CSS tokens.
