#!/usr/bin/python
# -*- coding: UTF-8 -*-
import os
import sys
import shutil
import json
import urllib2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header

#
# This file is deprecated
#


class Builer:
    # 项目根路径
    project_path = os.path.dirname(os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))))
    # android文件夹路径
    andorid_path = os.path.join(project_path, 'android')
    # ios文件夹路径
    ios_path = os.path.join(project_path, 'ios')
    # dist文件夹路径
    dist_path = os.path.join(project_path, 'dist')

    def __init__(self, *args):
        # 获取版本信息
        version_info = self.get_version_info()
        default_version_name = version_info['version_name']
        defalut_version_code = version_info['version_code']

        # Git分支，默认develop
        self.branch = args[0] if args[0] else 'develop'
        # 构建类型，选择 dev alpha beta rc，默认dev
        self.build_type = args[1] if args[1] else 'dev'
        # 版本名称，String，默认1.0
        self.version_name = args[2] if args[2] else default_version_name
        # 版本号，Numbers，默认1
        self.version_code = args[3] if args[3] else defalut_version_code
        # 平台，all android ios可选，默认all
        self.platform = args[4] if args[4] else 'all'
        # 是否上传至蒲公英，Boolean True False，默认False
        self.is_upload_pgyer = args[5] if args[5] else False
        # 版本更新说明，String，默认空
        self.update_instructions = args[6] if args[6] else ''
        # 是否邮件通知， Boolean True False，默认False
        self.is_mail_notification = args[7] if args[7] else False
        # 邮件接收者，以英文逗号分隔，例123@qq.com,456@sina.cn，默认空
        self.mail_receivers = args[8] if args[8] else ''
        # 是否钉钉机器人通知，Boolean True False，默认False
        self.is_ding_talk_notification = args[9] if args[9] else False

        # 获取包名称
        self.pack_name = self.generate_pack_name()
        # 获取包输出路径
        self.output_file_path = self.get_output_file_path()

        # print self.project_path
        # print self.andorid_path
        # print self.ios_path
        # print self.dist_path
        # print self.output_file_path

        self.pull_code()
        self.update_version_info()
        self.start_pack()
        self.copy_output_file_to_dist()
        appInfo = self.upload_to_pyger()
        self.send_mail(appInfo)
        self.send_ding_talk(appInfo)

    # 获取Android版本信息

    def get_android_version_info(self):
        # Android工程，gradle.properties文件绝对路径
        path = '%s/gradle.properties' % self.andorid_path
        # 读取文件，修改相应版本信息
        f = open(path, mode='r')
        line = f.readline()
        version_name = '1.0'
        version_code = '1'
        while line:
            if line.startswith('APP_VERSION_NAME'):
                version_name = line.split('=')[1].replace('\n', '')
            elif line.startswith('APP_VERSION_CODE'):
                version_code = line.split('=')[1].replace('\n', '')
            line = f.readline()
        f.close()
        return {'version_name': version_name, 'version_code': version_code}

    # 获取IOS版本信息

    def get_ios_version_info(self):
        print '不支持'

    # 获取版本信息

    def get_version_info(self):
        return self.get_android_version_info()

    # 切换分支，拉取代码，更新环境

    def pull_code(self):
        print '*****************切换分支，拉取代码，更新环境*****************'
        # cmd = 'git checkout $branch && git checkout . && git pull && yarn && react-native link'
        cmd = 'git checkout %s' % self.branch
        os.system(cmd)

    # 更新Android版本信息
    def update_android_version_info(self):
        # Android工程，gradle.properties文件绝对路径
        path = '%s/gradle.properties' % self.andorid_path
        # 读取文件，修改相应版本信息
        f = open(path, mode='r')
        content = ''
        line = f.readline()
        print ('line' + line)
        while line:
            if line.startswith('IS_JENKINS'):
                content += 'IS_JENKINS=true\n'
            elif line.startswith('APP_VERSION_NAME'):
                content += ('APP_VERSION_NAME=' + self.version_name + '\n')
            elif line.startswith('APP_VERSION_CODE'):
                content += ('APP_VERSION_CODE=' + self.version_code + '\n')
            else:
                content += line
            line = f.readline()
        f.close()

        # 写入文件
        if content:
            f = open(path, mode='w+')
            f.write(content)
            f.close()
        print ('更改后文件内容：\n%s' % content)

    # 更新ios版本信息
    def update_ios_version_info(self):
        print 'ios版本信息有待更新'

    # 更新版本信息，版本名称、版本号
    def update_version_info(self):
        if self.platform == 'android':
            self.update_android_version_info()
        elif self.platform == 'ios':
            self.update_ios_version_info()
        else:
            print '请检查你输入的platform'

    # android构建

    def android_build(self):
        cmd = 'cd android && ./gradlew clean && ./gradlew assembleDevDebug'
        if self.build_type.startswith('dev'):
            cmd = 'cd android && ./gradlew clean && ./gradlew assembleDevDebug'
        elif build_type.startswith('alpha'):
            cmd = 'cd android && ./gradlew clean && ./gradlew assembleAlphaRelease'
        elif self.build_type.startswith('beta'):
            cmd = 'cd android && ./gradlew clean && ./gradlew assembleBetaRelease'
        elif self.build_type.startswith('rc'):
            cmd = 'cd android && ./gradlew clean && ./gradlew assembleRcRelease'
        else:
            print '请检查你输入的build_type'
        os.system(cmd)

    # ios构建
    def ios_build(self):
        print 'ios自动构建有待集成'

    # 开始构建
    def start_pack(self):
        print '*****************开始构建*****************'
        if self.platform == 'android':
            self.android_build()
        elif self.platform == 'ios':
            self.ios_build()
        elif self.platform == 'all':
            self.andorid_path()
            self.ios_build()
        else:
            print '请检查你输入的platform'

    # 生成包名
    def generate_pack_name(self):
        pack_name_prefix = 'TalkTok'
        pack_name_suffix = 'apk'
        return '%s-%s-%s-%s-%s.%s' % (pack_name_prefix, self.version_name, self.version_code, self.build_type, 'debug' if self.build_type.startswith('dev') else 'release', pack_name_suffix)

    # 获取包输出路径
    def get_output_file_path(self):
        category = 'debug' if self.build_type.startswith('dev') else 'release'
        return '%s/app/build/outputs/apk/%s/%s/app-%s-%s.apk' % (
            self.andorid_path, self.build_type, category, self.build_type, category)  # apk文件绝对路径

    # 拷贝生成包文件
    def copy_output_file_to_dist(self):
        print '*****************拷贝apk*****************'
        src_path = self.output_file_path  # apk文件路径
        dst_path = self.dist_path  # 输出路径
        apk_name = self.pack_name  # 重命名apk

        if os.path.exists(dst_path):  # 文件夹存在
            shutil.copy2(src_path, dst_path)
            os.rename(dst_path + '/' + os.path.basename(src_path),
                      dst_path + '/' + apk_name)
        else:
            os.mkdir(dst_path)
            shutil.copy2(src_path, dst_path)
            os.rename(dst_path + '/' + os.path.basename(src_path),
                      dst_path + '/' + apk_name)

    # 上传至蒲公英
    def upload_to_pyger(self):
        if self.is_upload_pgyer:
            print '*****************上传蒲公英*****************'
            apk_path = '%s/%s' % (self.dist_path, self.pack_name)  # apk路径
            print '上传包路径：%s' % apk_path
            user_key = 'f1677eb1b9b176c8cc256f6744710827'
            api_key = '6eb47d86d6a2ab6ae47c0f824f28c6a3'
            pgyer_api = 'curl -F "file=@%s" -F "uKey=%s" -F "_api_key=%s" -F "installType=2" -F "password=bindo123" -F "updateDescription=%s" https://www.pgyer.com/apiv1/app/upload' % (
                apk_path, user_key, api_key, self.update_instructions)
            result = os.popen(pgyer_api).readlines()
            result = json.loads(result[0])
            if result['code'] == 0:
                print '成功上传至蒲公英：'
                print(result)
                return result['data']
        else:
            print '没有上传至蒲公英'
            return {}

    # 发送邮件
    def send_mail(self, appInfo):
        if self.is_mail_notification and self.mail_receivers and appInfo:
            print '*****************发送邮件*****************'
            # 第三方 SMTP 服务, 这里使用 QQ
            mail_host = "smtp.qq.com"  # 设置服务器
            mail_user = "865068275@qq.com"  # 用户名
            mail_pass = "voersxvgouhbbbfg"  # 口令

            sender = '865068275@qq.com'
            # receivers = ['865068275@qq.com']  # 接收邮件，可设置为你的QQ邮箱或者其他邮箱
            receivers = self.mail_receivers.split(',')
            print receivers

            attch_path = '%s/%s' % (self.dist_path, self.pack_name)  # apk路径
            # 蒲公英下载短链接
            download_url = 'https://www.pgyer.com/%s' % appInfo['appShortcutUrl'].encode(
                'utf-8')
            qrcode_url = appInfo['appQRCodeURL'].encode('utf-8')  # 蒲公英二维码url

            mail_msg = """
              <p>Kiosk %s-%s 版本构建成功了...</p>
              <img src="%s" />
              <p>您可以扫描二维码下载，或者<a href="%s" target="_Blank">点击此链接</a>进行下载，或者下载邮件提供的附件</p>
            """ % (self.version_name, self.version_code, qrcode_url, download_url)

            # message = MIMEText(mail_msg, 'html', 'utf-8')
            # message = MIMEText('Python 邮件发送测试...', 'plain', 'utf-8')
            message = MIMEMultipart()
            message.attach(MIMEText(mail_msg, 'html', 'utf-8'))
            message['From'] = Header("Barry", 'utf-8')
            message['To'] = Header("测试部门", 'utf-8')
            message['Subject'] = Header("TalkTok构建通知", 'utf-8')

            # 构造附件，传送apk文件
            attach = MIMEText(open(attch_path, 'rb').read(), 'base64', 'utf-8')
            attach["Content-Type"] = 'application/octet-stream'
            # 这里的filename，邮件中显示的名字
            attach["Content-Disposition"] = 'attachment; filename="%s"' % self.pack_name
            message.attach(attach)

            try:
                smtpObj = smtplib.SMTP()
                smtpObj.connect(mail_host, 25)    # 25 为 SMTP 端口号
                smtpObj.login(mail_user, mail_pass)
                smtpObj.sendmail(sender, receivers, message.as_string())
                print ("邮件发送成功")
            except smtplib.SMTPException as err:
                print ("Error: 无法发送邮件")
            finally:
                smtpObj.quit()
        else:
            print '没有发送邮件通知'

    # 发送钉钉

    def send_ding_talk(self, appInfo):
        if self.is_ding_talk_notification and appInfo:
            print '*****************发送钉钉*****************'
            # 蒲公英短链接
            download_url = 'https://www.pgyer.com/%s' % appInfo['appShortcutUrl'].encode(
                'utf-8')
            content = "TalkTok %s-%s构建成功，如有需要请前往%s下载" % (
                self.version_name, self.version_code, download_url)
            sendData = {"msgtype": "text", "text": {"content": content},
                        "at": {"atMobiles": ["13682563566"], "isAtAll": False}}
            # 将字典类型数据转化为json格式
            sendData = json.dumps(sendData)
            # python3的Request要求data为byte类型
            sendDatas = sendData.encode("utf-8")

            # 钉钉机器人通知
            ding_talk_url = 'https://oapi.dingtalk.com/robot/send?access_token=f76a4d942701319da3d60f6c2be940bdafc4d275aed158b9097b4bfe753bfd54'
            # 请求头部
            header = {"Content-Type": "application/json",
                      "Charset": "UTF-8"}
            # 发送请求
            request = urllib2.Request(
                url=ding_talk_url, data=sendDatas, headers=header)

            # 将请求发回的数据构建成为文件格式
            opener = urllib2.urlopen(request)
            # 打印返回的结果
            print '钉钉通知成功'
            print(opener.read())
        else:
            print '没有发送钉钉通知'


def main():

    # Git分支，默认develop
    branch = sys.argv[1]
    # 构建类型，选择 dev alpha beta rc，默认dev
    build_type = sys.argv[2]
    # 版本名称，String，默认1.0
    version_name = sys.argv[3]
    # 版本号，Numbers，默认1
    version_code = sys.argv[4]
    # 平台，all android ios可选，默认all
    platform = sys.argv[5]
    # 是否上传至蒲公英，Boolean True False，默认False
    is_upload_pgyer = sys.argv[6]
    # 版本更新说明，String，默认空
    update_instructions = sys.argv[7]
    # 是否邮件通知， Boolean True False，默认False
    is_mail_notification = sys.argv[8]
    # 邮件接收者，以英文逗号分隔，例123@qq.com,456@sina.cn，默认空
    mail_receivers = sys.argv[9]
    # 是否钉钉机器人通知，Boolean True False，默认False
    is_ding_talk_notification = sys.argv[10]

    builder = Builer(branch, build_type, version_name, version_code, platform, is_upload_pgyer,
                     update_instructions, is_mail_notification, mail_receivers, is_ding_talk_notification)


def input():
    print '**************************************************************************************'
    print '*                                                                                    *'
    print '*                            TalkTok自动构建                                     *'
    print '*                                                                                    *'
    print '**************************************************************************************'

    # Git分支，默认develop
    branch = raw_input('请输入git分支名称，默认develop：')
    # 构建类型，选择 dev alpha beta rc，默认dev
    build_type = raw_input('请选择输入dev alpha beta rc其中一种构建类型，默认dev：')
    # 版本名称，String，默认1.0
    version_name = raw_input('请输入版本名称，默认1.0：')
    # 版本号，Numbers，默认1
    version_code = raw_input('请输入版本号，默认1：')
    # 平台，all android ios可选，默认all
    platform = raw_input('请输入平台名称，默认all：')
    # 是否上传至蒲公英，Boolean True False，默认False
    is_upload_pgyer = raw_input('是否上传至蒲公英，是请输入True，否请输入False，默认False：')
    # 版本更新说明，String，默认空
    update_instructions = raw_input('如果上传至蒲公英，请输入更新说明，默认空：')
    # 是否邮件通知， Boolean True False，默认False
    is_mail_notification = raw_input('是否使用邮件通知，是请输入True，否请输入False，默认False：')
    # 邮件接收者，以英文逗号分隔，例123@qq.com,456@sina.cn，默认空
    mail_receivers = raw_input(
        '若使用邮件通知，请输入邮件接受者，以英文逗号分隔，例123@qq.com,456@sina.cn，默认空：')
    # 是否钉钉机器人通知，Boolean True False，默认False
    is_ding_talk_notification = raw_input(
        '是否使用钉钉机器人通知，是请输入True，否请输入False，默认False')

    builder = Builer(branch, build_type, version_name, version_code, platform, is_upload_pgyer,
                     update_instructions, is_mail_notification, mail_receivers, is_ding_talk_notification)


if __name__ == "__main__":
    # main()
    input()

    # python build/pack.py develop dev 1.0 1 android True '更新说明' False '' False
    # python build/pack.py development dev 1.0 12 android True '自动打包命令测试' True '865068275@qq.com,barry.xie@antcosa.com' True

    # result = ['{"code":0,"message":"","data":{"appKey":"9077c97471153b02b3c23972bb91fc13","userKey":"f1677eb1b9b176c8cc256f6744710827","appType":"2","appIsLastest":"1","appFileSize":"18085324","appName":"TalkTok","appVersion":"1.0","appVersionNo":"12","appBuildVersion":"3","appIdentifier":"com.kioskapp.dev","appIcon":"c40cbc076baa80eaa42a11c4e6bdb01c","appDescription":"","appUpdateDescription":"\\u81ea\\u52a8\\u6253\\u5305\\u547d\\u4ee4\\u6d4b\\u8bd5","appScreenshots":"","appShortcutUrl":"ulQS","appCreated":"2018-11-03 01:16:09","appUpdated":"2018-11-03 01:16:09","appQRCodeURL":"https:\\/\\/www.pgyer.com\\/app\\/qrcodeHistory\\/2141fc56aa8eb62d03492f7cd5c0e220e93fcb87b1059b72c38344c0ce4c6334"}}']
    # result = json.loads(result[0])
    # print result['data']
