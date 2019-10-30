from PIL import Image

im = Image.open('showback1.jpg')  


im1 = im.resize((1920, 1346)) 

im1.save('showback.jpg')


#1920 5292
#928