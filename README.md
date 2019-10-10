# cs2102_project

## Setup
1. Install Postgresql [download link](https://www.postgresql.org/)
2. Install Nodejs [link](https://nodejs.org/en/)
3. Install Angular [link](https://angular.io/)
4. Setup Postgres Database

### Postgres Server Setup
1. Setup a user as `postgres` and password `root`
2. Ensure Server is running on port `5432`
3. Create Database Called `cs2102_project`

### ExpressJs setup
1. cd to express-rest-server folder and run `npm install`
2. run `npm run add-data` to add test data into server
3. run `npm start` to launch the rest server
4. go to `localhost:3000` to view the project site


### Angular Frontend (Development)
1. cd to cs2102-project-frontend and run `npm install`
2. run `ng serve -o` to start the server

### Project Information Source
All project details are coming from [globalgiving](https://www.globalgiving.org/) and [giving.sg](https://www.giving.sg/)

### Project Assets
Theme - https://startbootstrap.com/template-overviews/sb-admin/
Icons - https://fontawesome.com/

### Assertions
1. Only admins can handle a report - At the time of handling the report (Trigger: checkReportHandling, Function: handleReportCheck)
2. Project cannot be pledged over its target amount (Trigger: checkPledgeAmt, Function: CheckProjectLimit)
3. Project can only be pledged when it has started (Trigger: checkPledgesDate, Function: checkProjectDate)

### Convience Features:
1. Logging for project and user (Trigger: - All the logging triggers, Functions: addUserLogging, addProjectLogging, logging)
2. Auto refund project when project is banned (Trigger: refundPledges, function: autoRefundPledges)

### Test Account Crudentials:
1. For user mode, use username:user and password: password to login in.
2. For admin mode, use username:admin and password: password to login in.