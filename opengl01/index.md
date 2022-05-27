# OpenGL Notes | Basics


OpenGL is a graphics API used for _real time rendering_ calculations that are processed by the GPU

### 1. Screen and Coordinates

```py
# Initialize pygame Screen
pygame.init()
# Screen Size
screen_width = 1000
screen_height = 800

screen = pygame.display.set_mode((screen_width, screen_height), DOUBLEBUF | OPENGL)
pygame.display.set_caption("OpenGL in Python")

# Specify which matrix is the current matrix
def init_ortho():
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity() # Clear the System
    gluOrtho2D(0, 1000, 0, 680)
    # set the window coordinates
    # (left, right, bottom, top)
```

`glMatrixMode(GLenum mode)`: sets the current matrix mode

- `GL_MODELVIEW`: Applies subsequent matrix operations to the modelview matrix stack.
- `GL_PROJECTION`: Applies subsequent matrix operations to the projection matrix stack.

`glLoadIdentity()`: replace the current matrix with the identity matrix

### Reference:

[1] https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glMatrixMode.xml  
[2] https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glLoadMatrix.xml  
[3] https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glLoadIdentity.xml

