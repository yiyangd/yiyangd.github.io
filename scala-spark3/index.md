# Data Engineering Notes | Scala Spark 3 


### 0. Introduction on Spark and Scala

#### Spark

Spark: a unified analytics engine for large-scale data processing.

- fast: Run programs up to 100x faster than Hadoop Mapreduce in memory, or 10x faster on disk
  - DAG(direct acyclic graph) Engine optimizes workflows

{{< figure src="/images/scala-spark/spark-scalable.png">}}

Apache Spark consists of Spark Core Engine, Spark SQL, Spark Streaming, MLlib, GraphX and Spark R.

- Spark Core: provides the in-built memory computing and referencing datasets stored in external storage systems and uses RDD data structure to speed up the data sharing in distributed processing systems like MapReduce from permanent storage like HDFS or S3 which may be slow due to the serialization and deserialization of I/O steps.
- Spark SQL: allows users to perform ETL(extract, transform and load) functions on data from a variety of sources in different formats like JSON, Parquet or Hive and then execute ad-hoc queries.
- Spark Streaming
- MLlib
- GraphX

### 1. Installation on MacOS

In https://spark.apache.org/docs/latest/ (updated on Sep 7, 2021)

- Spark runs on Java 8/11, Scala 2.12, Python 3.6+ and R 3.5+.
- Java 8 prior to version 8u92 support is deprecated as of Spark 3.0.0. For the Scala API, Spark 3.1.2 uses Scala 2.12. You will need to use a compatible Scala version (2.12.x).
- For Java 11, -Dio.netty.tryReflectionSetAccessible=true is required additionally for Apache Arrow library. This prevents java.lang.UnsupportedOperationException: sun.misc.Unsafe or java.nio.DirectByteBuffer.(long, int) not available when Apache Arrow uses Netty internally.

- https://medium.com/free-code-camp/installing-scala-and-apache-spark-on-mac-os-837ae57d283f#.hv79xf5ri
  - `brew cask install java` should be `brew install java --cask`
  - https://github.com/Homebrew/discussions/discussions/902
  - Error: Cask 'java' is unavailable: No Cask with this name exists.
  - solution: https://mkyong.com/java/how-to-install-java-on-mac-osx/
    - install java 8

```bash
% /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
% softwareupdate --install -a
% brew install openjdk@8
% sudo ln -sfn /usr/local/opt/openjdk@8/libexec/openjdksudo ln -sfn /usr/local/opt/openjdk@8/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-8.jdk
% java -version
openjdk version "1.8.0_302"
% brew install scala@2.12
% brew install apache-spark
% spark-shell
Welcome to

      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 3.1.2
      /_/

Using Scala version 2.12.10 (OpenJDK 64-Bit Server VM, Java 11.0.12)
Type in expressions to have them evaluated.
Type :help for more information.

[scala> :q
```

Go to Macbook Finder, press `command+shift+G` and input `/usr/local/Cellar`

- we can see the versions of Java, Scala and Spark
- Common Issue: Setting PATH in bash

```
% echo 'export PATH="/usr/local/opt/openjdk@8/bin:$PATH"' >> ~/.zshrc
% source ~/.zshrc

export SPARK_HOME=/usr/local/Cellar/apache-spark/3.1.2/libexec
export PYTHONPATH=/usr/local/Cellar/apache-spark/3.1.2/libexec/python/:$PYTHONP$
```

Downloads IntelliJ and install scala plugin

- Run HelloWorld.scala

```scala
package com.sundogsoftware.spark

import org.apache.spark._
import org.apache.log4j._

object HelloWorld {
  def main(args: Array[String]): Unit = {

    Logger.getLogger("org").setLevel(Level.ERROR)

    val sc = new SparkContext("local[*]", "HelloWorld")

    val lines = sc.textFile("data/ml-100k/u.data")
    val numLines = lines.count()

    println("Hello world! The u.data file has " + numLines + " lines.")

    sc.stop()
  }
}
/*
/Library/Java/JavaVirtualMachines/openjdk-8.jdk/Contents/Home/bin/java
Hello world! The u.data file has 100000 lines.

Process finished with exit code 0
*/
```

#### Reference:

- https://www.udemy.com/course/apache-spark-with-scala-hands-on-with-big-data/

