from PIL import Image

im = Image.open('filesback1.jpg')  


im1 = im.resize((1440, 720)) 

im1.save('filesback.jpg')


#1920 5292
#928