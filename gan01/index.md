# Deep Learning Notes | First GAN


Goal：build and train a basic GAN that can generate hand-written images of digits (0-9) by using Pytorch

Build the generator and discriminator components of a GAN from scratch.
Create generator and discriminator loss functions.  
Train the GAN and visualize the generated images.

### 0. Import Packages and visualizer function

```python
import torch
from torch import nn
from tqdm.auto import tqdm
from torchvision import transforms
from torchvision.datasets import MNIST # Training dataset
from torchvision.utils import make_grid
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt
torch.manual_seed(0) # Set for testing purposes, please do not change!

def show_tensor_images(image_tensor, num_images=25, size=(1, 28, 28)):
    '''
    Function for visualizing images: Given a tensor of images, number of images, and
    size per image, plots and prints the images in a uniform grid.
    '''
    image_unflat = image_tensor.detach().cpu().view(-1, *size)
    image_grid = make_grid(image_unflat[:num_images], nrow=5)
    plt.imshow(image_grid.permute(1, 2, 0).squeeze())
    plt.show()
```

### 1. Build the Generator Component

Create a function to make a single layer/block for the generator's neural network.

- Each block should include a linear transformation to map to another shape,
- a batch normalization for stabilization,
- and finally a non-linear activation function (you use a ReLU here) so the output can be transformed in complex ways.

```python
def get_generator_block(input_dim, output_dim):
    '''
    Function for returning a block of the generator's neural network
    given input and output dimensions.
    Parameters:
        input_dim: the dimension of the input vector, a scalar
        output_dim: the dimension of the output vector, a scalar
    Returns:
        a generator neural network layer, with a linear transformation
          followed by a batch normalization and then a relu activation
    '''
    return nn.Sequential(
        nn.Linear(input_dim, output_dim),
        nn.BatchNorm1d(output_dim),
        nn.ReLU(inplace=True),
    )
```

#### 1.1. Build the Generator class

It will take 3 values:

- the noise vector dimension
- the image dimension
- the initial hidden dimension

Using these values, the generator will build a neural network with 5 layers/blocks.

- Beginning with the noise vector, the generator will apply non-linear transformations via the block function until the tensor is mapped to the size of the image to be outputted (the same size as the real images from MNIST).
  - The final layer does not need a normalization or activation function, but does need to be scaled with a sigmoid function.
- Finally, implement a forward pass function that takes in a noise vector and generates an image of the output dimension using the neural network.

```python
class Generator(nn.Module):
    '''
    Generator Class
    Values:
        z_dim: the dimension of the noise vector, a scalar
        im_dim: the dimension of the images, fitted for the dataset used, a scalar
          (MNIST images are 28 x 28 = 784 so that is your default)
        hidden_dim: the inner dimension, a scalar
    '''
    def __init__(self, z_dim=10, im_dim=784, hidden_dim=128):
        super(Generator, self).__init__()
        # Build the neural network
        self.gen = nn.Sequential(
            get_generator_block(z_dim, hidden_dim),
            get_generator_block(hidden_dim, hidden_dim * 2),
            get_generator_block(hidden_dim * 2, hidden_dim * 4),
            get_generator_block(hidden_dim * 4, hidden_dim * 8),
            # the final layer needs to be scaled with a sigmoid function
            nn.Linear(hidden_dim * 8, im_dim),
            nn.Sigmoid()
        )
    def forward(self, noise):
        '''
        Function for completing a forward pass of the generator:
            Given a noise tensor, returns generated images.
        Parameters:
            noise: a noise tensor with dimensions (n_samples, z_dim)
        '''
        return self.gen(noise)

    # Needed for grading
    def get_gen(self):
        '''
        Returns:
            the sequential model
        '''
        return self.gen
```

#### 1.2. Create Noise Vectors

To be able to use the Generator, we need to create noise vectors.

- The noise vector z has the important role of making sure the images generated (from the same class) don't all look the same
  - think of it as a random seed.
- Since multiple images will be processed per pass, you will generate all the noise vectors at once.

```python
def get_noise(n_samples, z_dim, device='cpu'):
    '''
    Function for creating noise vectors: Given the dimensions (n_samples, z_dim),
    creates a tensor of that shape filled with random numbers from the normal distribution.
    Parameters:
        n_samples: the number of samples to generate, a scalar
        z_dim: the dimension of the noise vector, a scalar
        device: the device type
    '''
    # NOTE: To use this on GPU with device='cuda', make sure to pass the device
    # argument to the function you use to generate the noise.
    return torch.randn(n_samples,z_dim,device=device)

# Verify the noise vector function
def test_get_noise(n_samples, z_dim, device='cpu'):
    noise = get_noise(n_samples, z_dim, device)
    # Make sure a normal distribution was used
    assert tuple(noise.shape) == (n_samples, z_dim)
    assert torch.abs(noise.std() - torch.tensor(1.0)) < 0.01
    assert str(noise.device).startswith(device)

test_get_noise(1000, 100, 'cpu')
if torch.cuda.is_available():
    test_get_noise(1000, 32, 'cuda')
print("Success!")
```

### 2. Build the Discriminator Component

```python
def get_discriminator_block(input_dim, output_dim):
    '''
    Discriminator Block
    Function for returning a neural network of the discriminator given input and output dimensions.
    Parameters:
        input_dim: the dimension of the input vector, a scalar
        output_dim: the dimension of the output vector, a scalar
    Returns:
        a discriminator neural network layer, with a linear transformation
          followed by an nn.LeakyReLU activation with negative slope of 0.2
          (https://pytorch.org/docs/master/generated/torch.nn.LeakyReLU.html)
    '''
    return nn.Sequential(
         nn.Linear(input_dim, output_dim), #Layer 1
         nn.LeakyReLU(0.2, inplace=True)
    )
```

#### 2.1. Build the Discriminator class

The discriminator will build a neural network with 4 layers.

- It will start with the image tensor and transform it until it returns a single number (1-dimension tensor) output.
- This output classifies whether an image is fake or real.
- Finally, to use discrimator's neural network you are given a forward pass function that takes in an image tensor to be classified.

It will take 2 values:

- The image dimension
- The hidden dimension

```python
class Discriminator(nn.Module):
    '''
    Discriminator Class
    Values:
        im_dim: the dimension of the images, fitted for the dataset used, a scalar
            (MNIST images are 28x28 = 784 so that is your default)
        hidden_dim: the inner dimension, a scalar
    '''
    def __init__(self, im_dim=784, hidden_dim=128):
        super(Discriminator, self).__init__()
        self.disc = nn.Sequential(
            get_discriminator_block(im_dim, hidden_dim * 4),
            get_discriminator_block(hidden_dim * 4, hidden_dim * 2),
            get_discriminator_block(hidden_dim * 2, hidden_dim),
            # transform the final output into a single value,
            # so add one more linear map.
            nn.Linear(hidden_dim, 1)
        )

    def forward(self, image):
        '''
        Function for completing a forward pass of the discriminator: Given an image tensor,
        returns a 1-dimension tensor representing fake/real.
        Parameters:
            image: a flattened image tensor with dimension (im_dim)
        '''
        return self.disc(image)

    # Needed for grading
    def get_disc(self):
        '''
        Returns:
            the sequential model
        '''
        return self.disc
```

### 3. Set Parameters and load the MNIST dataset

```python
# Set your parameters
criterion = nn.BCEWithLogitsLoss() # the loss function
n_epochs = 200      # the number of times you iterate through the entire dataset when training
z_dim = 64          # the dimension of the noise vector
display_step = 500  # how often to display/visualize the images
batch_size = 128    # the number of images per forward/backward pass
lr = 0.00001        # the learning rate
device = 'cuda' # the device type, here using a GPU (which runs CUDA), not CPU
# Load MNIST dataset as tensors
dataloader = DataLoader(
    MNIST('.', download=False, transform=transforms.ToTensor()),
    batch_size=batch_size,
    shuffle=True)
```

### 4. Initialize the generator, discriminator, and optimizers.

Note that each optimizer only takes the parameters of one particular model, since we want each optimizer to optimize only one of the models.

```python
gen = Generator(z_dim).to(device)
gen_opt = torch.optim.Adam(gen.parameters(), lr=lr)
disc = Discriminator().to(device)
disc_opt = torch.optim.Adam(disc.parameters(), lr=lr)
```

### 5. Calculate the Loss

Since the generator is needed when calculating the discriminator's loss, you will need to call `.detach()` on the generator result to ensure that only the discriminator is updated

- This is how the discriminator and generator will know how they are doing and improve themselves.

#### Discriminator's Loss

We need a 'ground truth' tensor in order to calculate the loss.

- For example, a ground truth tensor for a fake image is all zeros.

```python
def get_disc_loss(gen, disc, criterion, real, num_images, z_dim, device):
    '''
    Return the loss of the discriminator given inputs.
    Parameters:
        gen: the generator model, which returns an image given z-dimensional noise
        disc: the discriminator model, which returns a single-dimensional prediction of real/fake
        criterion: the loss function, which should be used to compare
               the discriminator's predictions to the ground truth reality of the images
               (e.g. fake = 0, real = 1)
        real: a batch of real images
        num_images: the number of images the generator should produce,
                which is also the length of the real images
        z_dim: the dimension of the noise vector, a scalar
        device: the device type
    Returns:
        disc_loss: a torch scalar loss value for the current batch
    '''
    # Create noise vectors
    fake_noise = get_noise(num_images, z_dim, device=device)
    # generate a batch (num_images) of fake images.
    fake = gen(fake_noise)
    # Get the discriminator's prediction of the fake image
    disc_fake_pred = disc(fake.detach())
    # calculate the loss
    disc_fake_loss = criterion(disc_fake_pred, torch.zeros_like(disc_fake_pred))
    # Get the discriminator's prediction of the real image
    disc_real_pred = disc(real)
    # calculate the loss.
    disc_real_loss = criterion(disc_real_pred, torch.ones_like(disc_real_pred))
    # Calculate the discriminator's loss by averaging the real and fake loss
    disc_loss = (disc_fake_loss + disc_real_loss) / 2

    return disc_loss
```

#### Generator's Loss

```python
def get_gen_loss(gen, disc, criterion, num_images, z_dim, device):
    '''
    Return the loss of the generator given inputs.
    Parameters:
        gen: the generator model, which returns an image given z-dimensional noise
        disc: the discriminator model, which returns a single-dimensional prediction of real/fake
        criterion: the loss function, which should be used to compare
               the discriminator's predictions to the ground truth reality of the images
               (e.g. fake = 0, real = 1)
        num_images: the number of images the generator should produce,
                which is also the length of the real images
        z_dim: the dimension of the noise vector, a scalar
        device: the device type
    Returns:
        gen_loss: a torch scalar loss value for the current batch
    '''
    # Create noise vectors and generate a batch of fake images.
    fake_noise = get_noise(num_images, z_dim, device=device)
    # Get the discriminator's prediction of the fake image.
    fake = gen(fake_noise)
    # Calculate the generator's loss.
    disc_fake_pred = disc(fake)
    # the generator wants the discriminator to think that its fake images are real
    gen_loss = criterion(disc_fake_pred, torch.ones_like(disc_fake_pred))

    return gen_loss
```

### 6. Train the Generative Adversarial Network

For each epoch, we process the entire dataset in batches. For every batch, we need to update the discriminator and generator using their loss.

- Batches are sets of images that will be predicted on before the loss functions are calculated (instead of calculating the loss function after each image).

It’s also often the case that the discriminator will outperform the generator, especially at the start, because its job is easier.

- It's important that neither one gets too good (that is, near-perfect accuracy), which would cause the entire model to stop learning.
- Balancing the two models is actually remarkably hard to do in a standard GAN.

{{< figure src="/images/GAN/gan01.jpg" width="600">}}

```python
cur_step = 0
mean_generator_loss = 0
mean_discriminator_loss = 0
test_generator = True # Whether the generator should be tested
gen_loss = False
error = False
for epoch in range(n_epochs):

    # Dataloader returns the batches
    for real, _ in tqdm(dataloader):
        cur_batch_size = len(real)

        # Flatten the batch of real images from the dataset
        real = real.view(cur_batch_size, -1).to(device)

        ### Update discriminator ###
        # Zero out the gradients before backpropagation
        disc_opt.zero_grad()
        # Calculate discriminator loss
        disc_loss = get_disc_loss(gen, disc, criterion, real, cur_batch_size, z_dim, device)
        # Update gradients
        disc_loss.backward(retain_graph=True)
        # Update optimizer
        disc_opt.step()
        # For testing purposes, to keep track of the generator weights
        if test_generator:
            old_generator_weights = gen.gen[0][0].weight.detach().clone()


        ### Update generator ###
        # Zero out the gradients.
        gen_opt.zero_grad()
        # Calculate the generator loss
        gen_loss = get_gen_loss(gen, disc, criterion, cur_batch_size, z_dim, device)
        # Backprop through the generator
        gen_loss.backward()
        # Update the gradients and optimizer.
        gen_opt.step()


        # For testing purposes, to check that your code changes the generator weights
        if test_generator:
            try:
                assert lr > 0.0000002 or (gen.gen[0][0].weight.grad.abs().max() < 0.0005 and epoch == 0)
                assert torch.any(gen.gen[0][0].weight.detach().clone() != old_generator_weights)
            except:
                error = True
                print("Runtime tests have failed")

        # Keep track of the average discriminator loss
        mean_discriminator_loss += disc_loss.item() / display_step

        # Keep track of the average generator loss
        mean_generator_loss += gen_loss.item() / display_step

        ### Visualization code ###
        if cur_step % display_step == 0 and cur_step > 0:
            print(f"Step {cur_step}: Generator loss: {mean_generator_loss}, discriminator loss: {mean_discriminator_loss}")
            fake_noise = get_noise(cur_batch_size, z_dim, device=device)
            fake = gen(fake_noise)
            show_tensor_images(fake)
            show_tensor_images(real)
            mean_generator_loss = 0
            mean_discriminator_loss = 0
        cur_step += 1
```

