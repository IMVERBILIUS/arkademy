import greenfoot.*;
/**
* Write a description of class bg here.
*
* @author Andi Novianto@smkbisa2018
* @version trial
*/
public class tembok extends Actor
{
/**
* Act - do whatever the tembok wants to do. This
method is called whenever
* the ’Act’ or ’Run’ button gets pressed in the
environment.
*/
public tembok()
{
GreenfootImage img=getImage();
img.scale(img.getWidth()-70,img.getHeight()-70); //
mengatur skala image tembok
setImage(img);
}
public void act()
{
// Add your action code here.
}
}

