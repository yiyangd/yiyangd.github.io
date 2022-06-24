# MIT 18.S191 | Spring 2021 | Notes


# Note on Course: Introduction to Computational Thinking

Computational science can be summed up by a simplified workflow:

- `data` ==> `input` ==> `process` ==> `model` ==> `visualize` ==> `output`

Topics Include:

- Image Analysis
- Particle Dynamics and Ray Tracing
- Epidemic Propagation
- Climate Modeling

## Module 1: Images

- https://computationalthinking.mit.edu/Spring21/images/

### 1. Install Julia and Pluto

- Step 1: Download from https://julialang.org/downloads/
- Step 2: Open Julia and Install Pluto
  - To install Pluto, we want to run a package manager command. To switch from Julia mode to Pkg mode, type `]` (closing square bracket)
- Step 3: `import Pluto`
- Step 4: `Pluto.run()`

```julia
julia> ]
(@v1.7) pkg> add Pluto
julia> import Pluto
julia> Pluto.run()
```

### 2. Images as Data and Arrays

If we open an image on our computer or the web and zoom in enough, we will see that it consists of many tiny squares, or pixels ("picture elements").

- Each pixel is a block of one single colour
  - `black = RGB(0, 0, 0)`
  - `red = RGB(1, 0, 0)`
  - `green = RGB(0, 1, 0)`
  - `blue = RGB(0, 0, 1)`
- and the pixels are arranged in a two-dimensional square grid.

{{< figure src="/images/julia/01_images/palette.png" width="400">}}

Note that an image is already an approximation of the real world

- it is a two-dimensional, discrete representation of a 3D reality.

#### 2.1. Download and Load Images

```julia
begin
    url = "https://i.imgur.com/VGPeJ6s.jpg"
    # download to a local file. The filename is returned
    download(url, "dog.jpg")
    using Images
    dog = load("dog.jpg")
    # Image/Pixel is a RGB Type
    typeof(dog) # Matrix{RGB{N0f8}} (alias for Array{RGB{Normed{UInt8, 8}}, 2})

    size(dog) # (height, width) = (3675, 2988)

    typeof(dog[100,400]) # RGB{N0f8}
    # Crop the head
    (h,w) = size(dog)
	head = dog[(h ÷ 2):h, (w ÷ 10): (9w ÷ 10)]
    # ÷ is typed as \div + press <TAB>
end
```

{{< figure src="/images/julia/01_images/dog.png" width="400">}}

#### 2.2. Images Flip and Concatentaion as Matrix

{{< figure src="/images/julia/01_images/flip.png" width="400">}}

