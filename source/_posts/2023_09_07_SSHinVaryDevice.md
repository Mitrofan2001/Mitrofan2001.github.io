---
title: "Github - use the same SSH on different computers"
date: 2023-09-06 16:00:00
updated: 2023-09-06 16:00:00
tags: ["FrontEnd - github"]
categories: ["Note github"]
cover: "/img/webimg/github-cover.jpg"
comments: false
---
In Aetheras Day1   i got a new Macbook pro and big Monitor…but i have never used mac to develop any project. 

Due to the team’s frequent use of Github to develop any type of project (FrontEnd, BackEnd, Unity), I will need to use my Github account in the future.
At the same time, my GitHub has been using SSH keys to update or pull, and my CSE friend has helped me with setting them, but I don’t know how to control them.

Finally, I am successfully setting SSH in my new notebook!

## step1
prepare ur OLD and New device
and send two file to from OLD to New Device, these file is id_rsa and id_rsa.pub in ./user/>username</.ssh

## step2
in New Device generate new SSH keys:

#### in terminal

```shell
git config --global user.name "githubAccount"
git config --global user.email "githubEmail"
ssh-keygen -t rsa
```

(if it ask u input passphrase later, pls ignore that and press enter)

## step3
Get step1 two file to COVER in the same location as OLD device

## step4
if u get the error message about id_rsa is too open when u git clone or pull,
just key in some command to fix file accesse

#### in terminal

```shell
chmod 600 ~/.ssh/id_rsa
```

its linux command to mak sure the file only read and write by user.
