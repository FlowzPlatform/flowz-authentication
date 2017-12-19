# **FlowzAuthentication**
---
#### Authentication, Ldap and User Services

## Getting started

Take clone of project and execute following commands

```bash
$ cd FlowzAuthentication/auth
$ npm install
$ cd FlowzAuthentication/ldap
$ npm install
$ cd FlowzAuthentication/user
$ npm install
```
**url endpoints:**

Authentication Services : http://auth.flowz.com

Ldap Login : http://auth.flowz.com/api/ldapauth

Ldap Services: http://api.flowz.com/authldap
 
User Services : http://api.flowz.com/user
 
 

# **Authentication Services**
---


## login

*  **post**
     
       http://auth.flowz.com/api/login

  * **json body:**
    
	```json
	{
        "email":"provide email id",
        "password":"provide password"
	}                                                                
	```



## signup

*  **post**
     
       http://auth.flowz.com/api/setup

  * **json body:**
    
	```json
	{
        "email":"provide email id",
        "password":"provide password"
	}                                                                
	```

   * **note:** you can provide your own field for signup 

## change password
 
*  **post**
     
       http://auth.flowz.com/api/changepassword

  * **json body:**
    
	```json
	{
      "oldpass":"your old password",
      "newpass":"your new password"
    }                                                               
	```

## forget password

*  **post**
     
       http://auth.flowz.com/api/forgetpassword

  * **json body:**
    
	```json
	{
      "email":"your email id",
      "url":"your redirect url (ex. http://www.example.com)"
    }                                                               
	```

## reset password

*  **post**
     
       http://auth.flowz.com/api/resetpassword

  * **json body:**
    
	```json
	{
      "new_password":"provide your new password",
      "token":"provide your logintoken"
    }                                                              
	``` 

## userdetails

*  **post**
   
       http://auth.flowz.com/api/userdetails

* **Headers:**

   ***Authorization:*** provide logintoken

# **social login**
---

## **About** 

we are providing social login services like **(google,facebook,twitter,github,linkedin)** . users can use this services by request paticular login service url with
request parameter as success_url.after succesfully authenticated user can verify through email id when user first time redirect to success_url page and after succesfully verfied user logged in for particular project.  

* ***social login flow*** ![flow diagram](https://raw.githubusercontent.com/username/projectname/branch/path/to/img.png)

  **step:1** user can select social media platform to login with.
  
  **step:2** after succesfully authenticated user redirected to succesful_url page and ob_id padded to url. 

  **step:3** after user verify through email id on success_url page. 

  *  **post**
     
      http://auth.flowz.com/api/verifyemail
      
    * **json body:**

      ```json
      {
        "email":"email id",
        "id":"ob_id"
      }
	  ```
      **note:** ob_id is your registerd object_id and padded to success_url.
      
  **step:4** verified user succesfully logged in with particular your project and get logintoken.   

## google

* **generate client id and client secret**

	 https://console.developers.google.com
    
*  **post**
     
       http://auth.flowz.com/auth/Gplus

* **pass success_url with request**
     
    ```
    <form id="" name="" action="" method="post">
    <input type="hidden" name="success_url" value="your success_url">
    </form>
    ```
    
## facebook

* **generate client id and client secret**

	https://developers.facebook.com/
    
*  **post**
     
       http://auth.flowz.com/auth/facebook

* **pass success_url with request**
     
    ```
    <form id="" name="" action="" method="post">
    <input type="hidden" name="success_url" value="your success_url">
    </form>
    ```

## twitter

* **generate client id and client secret**

	https://developer.twitter.com/
    
*  **post**
     
       http://auth.flowz.com/auth/twitter

* **pass success_url with request**
     
    ```
    <form id="" name="" action="" method="post">
    <input type="hidden" name="success_url" value="your success_url">
    </form>
    ```

## linkedin

* **generate client id and client secret**

	https://developer.linkedin.com/
    
*  **post**
     
       http://auth.flowz.com/auth/linkedin

* **pass success_url with request**
     
    ```
    <form id="" name="" action="" method="post">
    <input type="hidden" name="success_url" value="your success_url">
    </form>
    ```

## github

* **generate client id and client secret**

	https://github.com/settings/developers
    
*  **post**
     
       http://auth.flowz.com/auth/github

* **pass success_url with request**
     
    ```
    <form id="" name="" action="" method="post">
    <input type="hidden" name="success_url" value="your success_url">
    </form>
    ```
    
# **User Services**
---

## alluserdetails

* **get**

      http://api.flowz.com/user/alluserdetails

* **Headers:**

  ***Authorization:*** provide logintoken
  
  
## getuserdetails

* **get**

       http://api.flowz.com/user/getuserdetails/:uid

* **Headers:**

  ***Authorization:*** provide logintoken  


*  **params:**
  
   **uid:** object_id 


## updateuserdetails

* **put**

       http://api.flowz.com/user/updateuserdetails/:uid

* **Headers:**

  ***Authorization:*** provide logintoken  


*  **params:**
  
   **uid:** object_id 
           

*  **json body** 

    ```json
    {
    "provide your updation field"
    }
    ```

## deleteuserdetails

* **delete**

       http://api.flowz.com/user/deleteuserdetails/:uid

* **Headers:**

  ***Authorization:*** provide logintoken  


*  **params:**
  
   **uid:** object_id 
           
# **Ldap Services**
---
## **About**

LDAP (Lightweight Directory Access Protocol) is a software protocol for enabling anyone to locate organizations, individuals, and other resources such as files and devices in a network, whether on the public Internet or on a corporate intranet.

An LDAP directory is organized in a simple "tree" hierarchy consisting of the following levels:

* The root directory (the starting place or the source of the tree), which branches out to
* Countries, each of which branches out to
* Organizations, which branch out to
* Organizational units (divisions, departments, and so forth), which branches out to (includes an entry for)
* Individuals (which includes people, files, and shared resources such as printers)

## login

* **post**

       http://auth.flowz.com/api/ldapauth
       

*  **json body** 

    ```json
    {
     "email":"email id",
     "password":"password"
    }
    ```
## init

* **post**

       http://api.flowz.com/authldap/init
       
*  **json body** 

    ```json
    {
     "app":"appname"
    }
    ```
## userslist

* **get**

       http://api.flowz.com/authldap/userslist/:role   
       
 * **params**       

   **"role"**:"rolename"
   
## useradd

* **post**

       http://api.flowz.com/authldap/useradd
       

*  **json body** 

    ```json
    {
      "cn":"common name",
      "sn": "surname",
      "gidNumber": "group idNumber",
      "givenname": "givenname",
      "mail": "email id",
      "uid": "user id",
      "uidNumber": "user idNumber",
      "userpassword": "userpassword"
    }
    ```
## addroles

* **post**

       http://api.flowz.com/authldap/addRoles
       

*  **json body** 

    ```json
    {
      "groupname":"groupname",
      "um":"unique member Dn",
      "owner":"owner Dn"
    }
    ```    

## getroles

* **get**

       http://api.flowz.com/authldap/getroles
       
       
## setpermission

* **post**

       http://api.flowz.com/authldap/setpermission
       

*  **json body** 

    ```json
    {
      "resourceId":  "resource id" ,
      "roleId":  "role id " ,
      "taskType":  "tasktype",
      "accessValue": "access value",
      "app":"appname"
    }
    ```   
## getpermission

* **get**

       http://api.flowz.com/authldap/getpermission/:app/:taskType/:roleId/:resourceId    
       
 * **params**

   **"app"**:"appname"
   
   **"taskType"**:"taskType"
   
   **"roleId"**:"roleId"
   
   **"resourceId"**:"resourceId"

## getallpermission

* **get**

       http://api.flowz.com/authldap/getallpermission/:app
       
 * **params**       

   **"app"**:"appname"

