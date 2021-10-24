# Github OAuth Configuration

To authenticate with Github, must be configured one pair [client id, client secret] to each front-end app.

To create OAuth secrets, access [Github OAuth page](https://github.com/settings/developers), click **OAuth Apps** and **New OAuth App**.

### Configurations for WEB App
1. Copy **Client ID** and save in the backend and front end projects.
2. Generate a **client secret** and save in the backend only.
3. Set the **Home Page URL** to backend root URL (http://localhost:8000).
4. Set the **Authorization callback URL** to frontend root URL (http://localhost:3000).

### Configurations for Mobile App (with Expo)
1. Copy **Client ID** and save in the backend and front end projects.
2. Generate a **client secret** and save in the backend only.
3. Set the **Home Page URL** to **https://auth.expo.io/@<span style="color:gold">\<expo username\></span>/<span style="color:gold"><app name\></span>**.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.1. To get the Expo username, enter with login in [Expo login](https://expo.dev/login).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.2. To get the app name, open **app.json** and copy the **expo.name** value.

4. The **Authorization callback URL** must be equals to Home Page URL.
