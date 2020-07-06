#!/bin/bash

#
#  Deprecated
#

# branch=${branch#*/}
echo 'branch:' $branch
if [ -z "$branch" ]
then
    branch='default'
    echo '请选择分支'
    exit
fi

echo 'build_type:' $build_type
if [ -z "$build_type" ]
then
    build_type='default'
fi

echo 'platform:' $platform
if [ -z "$platform" ]
then
    platform='default'
fi

echo 'version_name:' $version_name
if [ -z "$version_name" ]
then
    version_name='default'
fi

echo 'version_code:' $version_code
if [ -z "$version_code" ]
then
    version_code='default'
fi

echo 'is_upload_pgyer:' $is_upload_pgyer
if [ -z "$is_upload_pgyer" ]
then
    is_upload_pgyer='default'
fi

echo 'is_upload_fir:' $is_upload_firm
if [ -z "$is_upload_firm" ]
then
    is_upload_firm='default'
fi

echo 'update_description:' $update_description
if [ -z "$update_description" ]
then
    update_description='default'
fi

echo 'is_mail_notification:' $is_mail_notification
if [ -z "$is_mail_notification" ]
then
    is_mail_notification='default'
fi

echo 'mail_receivers:' $mail_receivers
if [ -z "$mail_receivers" ]
then
    mail_receivers='default'
fi

echo 'is_ding_talk_notification:' $is_ding_talk_notification
if [ -z "$is_ding_talk_notification" ]
then
    is_ding_talk_notification='default'
fi

python cli/builder/jenkins.py ${branch} ${build_type} ${platform} ${version_name} ${version_code} ${is_upload_pgyer} ${is_upload_fir} ${update_description} ${is_mail_notification} ${mail_receivers} ${is_ding_talk_notification}

# python cli/builder/jenkins.py develop dev all default default false default false default false
