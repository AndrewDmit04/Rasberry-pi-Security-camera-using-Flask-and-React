# Description
This project is a comprehensive system comprising a backend Python-Flask server and a frontend React server. Once the setup process is completed, you gain the capability to deploy your Raspberry Pi at any location within your local network. This setup provides you with seamless access to both the live camera feed and files stored on the Raspberry Pi, offering the convenience of monitoring and managing your Raspberry Pi remotely from any connected device.

# Intalation 
Run to install the repository 
<pre>
  git clone "https://github.com/AndrewDmit04/Rasberry-pi-Security-camera-using-Flask-and-React/tree/main"
</pre>
## Setting up IP addresses
1. Get the ip of your computer
   ## Mac and Linux
   <pre>ifconfig           #run inside terminal </pre>
   ## Windows
   <pre>ipconfig           #run inside of command propmpt</pre>
2. Go into the Client folder and put the IP address into the package-lock.json file
   <pre>"start": "react-scripts start --host YOUR_IP_HERE"           #Replace where it says YOUR_IP_HERE with the IP of the computer
   "start": "react-scripts start --host 122.161.0.140"          #Example
   </pre> 
3. Go into the Client folder then the src folder then app.js and place the IP in there.
   <pre>const backEndserverIp = "http://YOUR-IP:5000"                #Replace YOUR-IP with the IP of the computer
   const backEndserverIp = "http://122.161.0.140:5000"          #Example
   </pre>
4. Go into the flask-server file, open the Python program server.py, and place your IP there.
   <pre>SERVER_IP = 'YOUR IP'                                        #Replace YOUR IP with the IP of the computer
   SERVER_IP = '122.161.0.140'                                  #Example
  </pre>

## Installing dependencies

1. Go into client and run:
   <pre>npm install                                    #installs all necessary packages</pre>
2. Go into flask-server and run this command:
   <pre>pip install flask flask-cors opencv-python     #intalls all necessary packages for python sever</pre>

## Starting the Server
1. Go into client and run:
  <pre>npm start             #Starts a front-end server on the local network under the address of http://122.161.0.140:3000</pre>
2. Go into flask-server file and run:
   ## Windows and Linux:
   <pre>python server.py     #starts the back-end server</pre>
   ## Mac
   <pre>python3 server.py    #starts the back-end server</pre>

# Result
   You have now hosted both the front-end and back-end of the website you will be able got to http://YOURIP:3000
   and see the live feed of the Rasberry PI as well as look at the videos recorded and download them.
