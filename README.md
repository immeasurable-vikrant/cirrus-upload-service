

# Cloud9 - Making the Web faster
## Architecture:
    There are 3 services I've made:
    - upload service : upload the user's code to cloud9 system
    - deployment service : build (html/css/js) and deploy 
    - request handler service 

### 1. Upload Service:
    Upload service is nothing but a backend server which needs to take a github url as an input and copy over all the contents of the github repo into the vercel systems.

    Object Store - it's a place where you usually store your assets - mp4/jpg/png and even html/css/js files.

                                    ------------> Github 
                                    |           /
                                    |          /
                                    |         /
                                    |        /
    github url  --------------> "UPLOAD SERVICE"
                                    |       \
                                    |        \
                                    |         \
                                    |          \
                                    -----------> S3 (Object Storage)
### 2. Deployment Service
    Deployment service - given that we have our project now on S3 Object Store, copy this project from S3 onto a 'system; and actually build a project means convert the react project over to HTML/CSS/JS and put it back into S3 so that by the end of it we have the final set of HTML/CSS/JS files that we need to serve to the users in the next stage.

### 3. Request Service
    Given the project that has been uploaded to S3 and that has been deployed, how do we serve the requests from the user when a user comes to your website and asks for - okay! give me 'xyz.vercel.app', the code the HTML/CSS/JS, -  the website that points to this deployment('xyz.vercel.app'), the "Request Server" needs to go to S3 - get back the HTML/CSS/JS  files taht you have created over the last step and serve back to the end user ---> ('xyz.vercel.app').

    It needs to find what is the "id" that the user trying to visit and based on that get the assets from the S3 and give it back to user.


#### Few Takeaways :
    - Upload service and Deployment service are separate - the reason for this is the upload service is very simple - copying the code  from ghithub and puttin on the S3 store and do not require a lot of CPU. So, you doesnt necessarily need to auto scale the service. Deployment on the other hand is very CPU intensive, if you are running `npm run build`, if you're converting a react project over HTML/CSS/JS- that requires a lot of CPU & you dont want the `upload service` to be affected in case of one project that is taking a lot of CPU on a mchine.

    - Building the project means - for a react project atleast, we need to convert that HTML/CSS/JS files then we serve these files as normal and we don't have to do anything extra. The process of converting the React project into the HTML/CSS/JS is called `Building the project` and this is the CPU intensive task we talked about above.

    - We need to serve HTML/CSS/JS file and not directly React files is beacause Browser only understands Javascript/HTML/CSS.

# cloud9-upload-service:


    

             
