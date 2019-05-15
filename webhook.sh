#!/bin/bash
WEB_PATH='/data/'$1
WEB_USER='root'
WEB_USERGROUP='root'

if [ ! -d $WEB_PATH  ];then
    cd /data/
    echo "Start clone "$WEB_PATH
    git clone $2
    cd $WEB_PATH
else
    echo "Start deployment "$WEB_PATH
    cd $WEB_PATH
    echo "pulling source code..."
    git reset --hard origin/master
    git clean -f
    git pull origin master
    # git checkout master
fi
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "install dependancy..."
cnpm i
cnpm run dev 
echo "Finished."