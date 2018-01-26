### Independent Study Spring 2018

The idea of this independent study is to learn how to develop a web application from scratch, i.e. to perform full stack developing. The end goal of this independent study is to get familiar with full stack development through creating a website that has social media-esque features. 

### Pulling and initializing the app
In order to get the app to run at all, you first need to pull/clone/download the project. Navigate to the `server` directory and run `npm install`. Then navigate to the `server/client` directory and run the `npm install` command again. You can then naviagte back to the server directory.

### Setting up databse
In order to run this app properly in development, the local database must be set up. Install mysql by following the isntructions here: https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e. Set up a local dev password by using the command from that page: `mysqladmin -u root password 'yourpassword'`. From the server directory, run `npm run seed`. You can then navigate to the database by running the command `mysql -u root -p` and typing in the password you set up from the previous step. Next, once in the mysql interface, type `use jmbisdev` to enter the development database. Type `select * form user` to display the current information stored in the user table. It will initially be empty.

### Running client and backend server
From the server directory, run `npm run dev` and allow all servers to boot up. Once both servers are up and running, you can navigate to `http://localhost:3000/` to view the client side of the app. You can then fill out the register fields in order to create a user. The error handling as of 1/26/2018 doesn't actually tell the user what went wrong in registration or in signing in, so here are the rules: Your name has to have atleast 1 character, your email has to be a real email (i.e. must be in the form of [charsequence]@[charsequence].com), and your password must be atleast 8 characters long with atleast 1 capital letter at atleast 1 number. Once you register an account, you can run `select * form user` from your mysql interface again and you should see the user present in the table. You can then sign in using your credentials (email and password), and you'll be redirected to the welcome page (currently doesnt do anything). After about 15 seconds, your credentials will expire, and if you refresh the page, you'll return to the registration/sign in page.


# Helpful development notes for myself
prettier options: --use-tabs --single-quote  --write

to reseed the database, run `npm run seed` from the /server directory. To start up database, run `mysql -u root -p` then type `use jmbisdev` for the development database.