**Tax Calculator**

This is a simple tax calculator built with React that allows users to enter their annual income and the tax year, and calculates their income tax based on the tax bands for the specified year.

Note: Tax year must be between 2019 and 2022.

**Features**

Users can enter their annual income and tax year
The tax calculator fetches the tax bands for the specified year from a server
The income tax is calculated based on the tax bands and the user's income
The total income tax and effective tax rate are displayed
The income tax is broken down by tax band and displayed in a table

**Tech Stack**

React
React hooks (useState, useCallback, useMemo)
React-toastify for displaying error messages
CSS for styling

**How to run the app**

Clone the repository to your local machine.
Install the necessary dependencies by running npm install or npm install --force if any issues.
Run the frontend by running the command npm run dev from the root directory of the project.
Open your web browser and go to http://localhost:5173 to view the application.
Note: Make sure that you have Docker and Node.js installed on your machine before running the application.

**How to test the app**

To run tests, use the following command:
npm run test

To generate a coverage report, use the following command:
npm run test:coverage

To run tests in watch mode, use the following command:
npm run test:watch

The tests are written using Jest and React Testing Library. Mock Service Worker (MSW) is used to mock the API calls.

**Build and Deployment**

To build the application, use the following command:
npm run build
This will generate a dist folder with the production build.

To preview the production build, use the following command:
npm run preview
This will start a local server to preview the production build.

The application can be easily deployed to a platform like Vercel or Netlify using continuous integration tools like GitHub Actions or Travis CI.

**Future improvements**

Improve the user interface and experience
Allow users to select their location and calculate taxes based on their jurisdiction
Add the ability to compare taxes across multiple tax years

**Acknowledgements**

This project was built as a Take Home Challenge for Points : A Plusgrade Company
