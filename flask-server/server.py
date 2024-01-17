##############################################################################################
#CODE WRITTEN BY: Andrew Dmitrievsky
#PURPOSE: create a React-flask application that could monitor any part of the
#house. It will be able to record videos and store them on the server, run facial recognition
#and store the faces on the server, and will produce a live feed of the camera.
#It will also be able to show the recorded videos and faces inside the application
##############################################################################################

from flask import Flask, Response, jsonify,send_file
from flask_cors import CORS
import threading,time,base64,os
import cv2 as cv
from queue import Queue
from datetime import datetime

########setup###########
SERVER_IP = 'YOUR IP'
MAX_FACES_IN_FILE = 200
MAX_RECORDINGS_IN_FILE = 100
MAX_RECENT_FACES = 10


#declare the flask app
app = Flask(__name__)                                          

# Enable CORS for all routes in the Flask application
CORS(app)                                                      
#face cascade for facec recognition
face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
face_buffer = []   #face buffer for all the images of the faces

def get_datetime(file_name):
    return datetime.strptime(file_name, "%Y:%m:%d::%H:%M")  # Parse 'file_name' string into a datetime object using the specified format
def sort_times(dates):
    formated = [file.split("_")[0] for file in dates] #get all the dates of the images as a list
    sorted_dates = sorted(formated, key=get_datetime) #sort the list oldest to newest
    return sorted_dates[::-1]   #return the reversed list to get which ones to delete

def delete_old_videos():
    path_to_videos = './Recorded/Recordings'
    path_to_thumbnails = './Recorded/thumbnails'
    video_files = [file for file in os.listdir(path_to_videos) if file.endswith('.avi')]    #get all the files in the directory
    if len(video_files) > MAX_RECORDINGS_IN_FILE:
        video_files = [file[:-4] for file in video_files]                                       #get rid of the extension on at the back of the name
        sorted_videos = sort_times(video_files)                                                 #sort all the files based on time
        sorted_videos = [file + ".avi" for file in sorted_videos]                               #put back the extension on all the files
        while len(sorted_videos) > MAX_RECORDINGS_IN_FILE:
            removing_video = sorted_videos.pop()
            removing_thumbnail = removing_video[:-4] + ".jpg"
            os.remove(path_to_videos + "/" + removing_video)
            os.remove(path_to_thumbnails + "/" + removing_thumbnail)

def delete_old_faces():                       #function will delete all old faces in the file
    max_faces = MAX_FACES_IN_FILE             #asign a max number of faces inside the file
    path_to_photos = "./Recorded/faces"       #path to the faces images
    face_photos = [file for file in os.listdir(path_to_photos) if file.endswith('.jpg')]    #get a list of all the images in the file
    if len(face_photos) > max_faces:          #if the length is more than it should be
        sorted_faces = sort_times(face_photos) #sort the faces based on the date returns the oldest last
        while len(face_photos) > max_faces:   #while the length of the faces array is more than it should be
            remove = sorted_faces.pop()       #pop the last image in the array which is the oldest one
            index = [file.split('_')[0] for file in face_photos].index(remove)  #get the index of the oldest component in the file name array
            removing = face_photos.pop(index)   #remove the oldest photo in the array
            os.remove(path_to_photos + "/" + removing)  #remove the photo from the file

def add_faces(frame,faces):         #add faces to the recent faces buffer
    num_of_faces = 1                #num of faces incase there more than one face in a frame
    for(x,y,w,h) in faces:          #get the coordinates of the faces in the frame
        face_buffer.append(frame[y-10:y+h+10, x-10:x + w+ 10])  #append the face image inside the buffer plus some margin around the face
        current_date_time = datetime.now()  #get the current dateTime
        cv.imwrite(current_date_time.strftime("./Recorded/faces/%Y:%m:%d::%H:%M") + f'_{num_of_faces}' +'.jpg' ,frame[y-10:y+h+10, x-10:x + w+ 10]) #write the image to the file
        num_of_faces += 1   #add one to num of faces if more faces then the file will have a different name
    while len(face_buffer) > MAX_RECENT_FACES:  #if the buffer length is more than it should be keep popping the faces until its right
        face_buffer.pop(0)  #pop the first face or the oldest
    delete_old_faces()      #delete all the old faces from the file
   
def cv2_to_base64(image):   #function to convert from cv image to base64 format
    val, buffer = cv.imencode('.jpg',image)     #encode the image
    text = base64.b64encode(buffer).decode('utf-8') #convert to base64
    return text     #return the image as text

def getFileName(camera):    #function to get the file name for the video being recorded
    current_date_time = datetime.now()  #get the current date and time
    ret,frame = camera.read()       #get the current frame for the thumbnail of the vide
    cv.imwrite(current_date_time.strftime("./Recorded/thumbnails/%Y:%m:%d::%H:%M") + '.jpg' , frame)    #wrtie a thumbnail for the video with the same name as the video
    return current_date_time.strftime("./Recorded/Recordings/%Y:%m:%d::%H:%M") + '.avi' #return the name of the recording video

# Video feed generator
frame_queue = Queue(maxsize=10) #set a queue of frames with a max size of 10
def generate_video_feed():
    cap = cv.VideoCapture(0)                    #get camera with index 0
    fourcc = cv.VideoWriter_fourcc(*'XVID')     #set  video Writer to record in .avi
    out = cv.VideoWriter(getFileName(cap), fourcc, 20.0, (640, 480))   #set an out to write the frames to
    delete_old_videos()             #delete all the old videos
    startTimeRecord = time.time()       #get the recording start time
    startTimeFace = time.time()         #get the first face start time
   
    if not cap.isOpened():              #if the camera could not be opened
        print("Error could not open camera")  #print the error
        return                          #return
    while True:
        ret, frame = cap.read()         #read a frame from the camera
        if not ret:                     #if the frame was not read
            print("failed to read frame") #print the error
            break                       #break out of the loop

        out.write(frame)                #write the frame to the file      
        if time.time() - startTimeFace > 2:     #scan for a face every two seconds
            gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)    #get the gray version of the frame
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30)) #detect all the faces
            add_faces(frame,faces)      #add the faces to the buffer plus the file
            startTimeFace = time.time() #get a new start time for the faces

        if time.time() - startTimeRecord > 360: #every 6 minuetes start a new recording
            out.release()                   #release the old recording
            out = cv.VideoWriter(getFileName(cap), fourcc, 20.0, (640, 480)) #get a new file name
            delete_old_videos()             #delete all the old videos
            startTimeRecord = time.time()   #get a new start recording time
   
        ret, jpeg = cv.imencode('.jpg', frame)  #encode the frame as a jpeg
        if not ret:                             #if not encoded
            print("failed to encode frame")     #print the error
            continue                            #contunie
       
        cv.waitKey(1)      #waitkey 1 to ensure a delay between frames
       
        try:
            frame_queue.put(jpeg.tobytes(), block=False) #put the frame in the frame queue
        except:
            pass    #if doesent work pass
   
    cap.release()   #if loop exists release the camera
    out.release()   #release the writing stream
    cv.destroyAllWindows()  # Close all OpenCV windows


def get_video_feed():   #will get the video feed from the queue
    while True:
        frame = frame_queue.get()   #get a frame from the queue
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')  #encode it as image and return-yield it

# Video feed route
@app.route('/video_feed')
def video_feed():  
    return Response(get_video_feed(), mimetype='multipart/x-mixed-replace; boundary=frame') #return the video feed as a response will look like a video

#Status of the server
@app.route('/status')
def home():
    return jsonify({'status' : 'good'}),200 #return the status of the server

#face buffer of images
@app.route('/Faces')
def Images():
    faces = [cv2_to_base64(img) for img in face_buffer] #return the face buffer as base64 text
    return jsonify({'faces' : faces}),200  #json response of the array of base64 images

#All the videos inside of recorded file
@app.route('/videos')
def serve_videos():
    path_to_videos = './Recorded/Recordings'
    video_files = [file for file in os.listdir(path_to_videos) if file.endswith('.avi')]    #get all the files in the directory
    video_files = [file[:-4] for file in video_files]                                       #get rid of the extension on at the back of the name
    sorted_videos = sort_times(video_files)                                                 #sort all the files based on time
    sorted_videos = [file + ".avi" for file in sorted_videos]                               #put back the extension on all the files
    return jsonify(sorted_videos)                                                           #return the sorted file list

#Serve the video requested from the recorded file
@app.route('/videos/<filename>')
def serve_video(filename):
    video_path = './Recorded/Recordings/' + filename                                        #get the path to the requested video
    return send_file(video_path,as_attachment=True, mimetype='video/x-msvideo')             #return the video as an attachment to download it for the user

#gets the thumbnail for the video
@app.route('/thumbnails/<filename>')
def get_image(filename):
    image_path = './Recorded/thumbnails/' + filename[:-3] + "jpg"   #get the thumbnail based on the video requested
    return send_file(image_path, mimetype='image/jpeg') # Return the image file as a response

#Returns all the faces inside of Recorded Faces file
@app.route('/faceImages')
def serve_faces():
    path_to_faces = './Recorded/faces'                  
    face_files = [file for file in os.listdir(path_to_faces) if file.endswith('.jpg')]  #get all the images inside of the file
    sorted_faces = sort_times(face_files)   #sort all the images based on when they were created
    sorted_faces_tagged = []                #created a new array so that we can get a sorted array with the old file names
    for i in range(0,len(sorted_faces)):    #for each sorted face image
        index = [file.split('_')[0] for file in face_files].index(sorted_faces[i])  #find the index inside of the old array
        sorted_faces_tagged.append(face_files[index])   #append it to the new array
    return jsonify(sorted_faces_tagged) #return the sorted array of faces

#Serve the face image requested
@app.route('/faceImages/<faceName>')
def get_face(faceName):
    face_path = './Recorded/faces/' + faceName  #get the path of the image
    return send_file(face_path, mimetype='image/jpeg')  #serve the image

if __name__ == '__main__':
    video_thread = threading.Thread(target=generate_video_feed) #start a thread that constantly records even if the page isn't opened
    video_thread.daemon = True  #set daemon to true so the program stops when the main program stops
    video_thread.start()    #start the thread
    app.run(host=SERVER_IP,port=5000)   #start the flask server
