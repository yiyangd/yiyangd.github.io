# Install Python, Tensorflow, Pytorch, CUDA on Ubuntu 20.04 in 2022


### 0. Check System, CPU, GPU

```shell
$ sudo lshw -C display
$ lscpu
```

- GPU: NVIDIA GeForce GTX 1060 3GB
- CPU: Intel i7-5820K

####

1. Download and use Miniconda (latest Version 3.9)

- https://docs.conda.io/en/latest/miniconda.html#linux-installers

> Conda is an open source package management system and environment management system that runs on Windows, macOS and Linux. Conda quickly installs, runs and updates packages and their dependencies. Conda easily creates, saves, loads and switches between environments on your local computer. It was created for Python programs, but it can package and distribute software for any language.
>
> - Miniconda is a free minimal installer for conda. It is a small, bootstrap version of Anaconda that includes only conda, Python, the packages they depend on, and a small number of other useful packages, including pip, zlib and a few others.

```shell
$ cd /Downloads
$ chmod +x ./Miniconda
$ ./Miniconda3-
```

Reboot the terminal

```
python --version

conda install -y jupyter

conda create --name tensorflow python=3.9

conda activate tensorflow

conda install nb_conda

conda install -c anaconda tensorflow-gpu

conda env update --file tools.yml

python -m ipykernel install --user --name tensorflow --display-name "Python 3.9 (tensorflow)"
```

Reboot Termimal

```
conda activate tensorflow
python
impoort tensorflow as tf
tf.__version__
len(tf.config.list_physical_devices('GPU"))
```

## Cuda Family

### 1. Check CUDA version

```shell
$ nvidia-smi
```

- NVIDIA-SMI: 470.86
- Driver Version: 470.86
- CUDA Version: 11.4

### 2. Download cuDNN

https://developer.nvidia.com/rdp/cudnn-archive

Download cuDNN v8.0.5 (Nov 9th, 2020) for CUDA 11.0

- https://developer.nvidia.com/cuda-11-0-3-download-archive?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=20.04&target_type=runfile_local

```shell
$ wget https://developer.download.nvidia.com/compute/cuda/11.0.3/local_installers/cuda_11.0.3_450.51.06_linux.run

$ sudo sh cuda_11.0.3_450.51.06_linux.run
```

### 3. Install cuDNN

- https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html#installlinux

Open a new terminal, unzip the cuDNN package just downloaded

```shell
~/Downloads$ tar -xvf cudnn-11.0-linux-x64-v8.0.5.39.tgz
```

Source

```shell
$ ls -l /usr/local/cuda
$ nano ~/.bashrc
```

Copy the following files into the CUDA toolkit directory

```shell
$ sudo cp cuda/include/cudnn*.h /usr/local/cuda/include
$ sudo cp -P cuda/lib64/libcudnn* /usr/local/cuda/lib64
$ sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*

```

