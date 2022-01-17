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

