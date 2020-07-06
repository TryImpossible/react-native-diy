# -*- coding: UTF-8 -*-
import os
import sys
import shutil
import json
import urllib2
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header

# 项目根路径
project_path = os.getcwd()
# android文件夹路径
andorid_path = os.path.join(project_path, 'android')
# ios文件夹路径
ios_path = os.path.join(project_path, 'ios')
# dist文件夹路径
dist_path = os.path.join(project_path, 'dist')


def update_code(branch):
    """
    更新代码

    Args:

    Return:

    Raises:
    """
    cmd = 'git checkout %s && git pull' % branch
    os.system(cmd)


def config_env():
    """
    配置环境

    Args:

    Return:

    Raises:
    """
    # cmd = 'yarn && react-native link'
    cmd = 'yarn'
    os.system(cmd)


def get_android_version_info():
    """
    获取Android版本信息

    Args:

    Return:

    Raises:
    """

    # Android工程，gradle.properties文件绝对路径
    path = '%s/gradle.properties' % andorid_path
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


def get_ios_version_info():
    """
    获取IOS版本信息

    Args:

    Return:

    Raises:
    """
    print '不支持'


def get_version_info():
    """
    获取版本信息

    Args:

    Return:

    Raises:
    """
    return get_android_version_info()


def update_android_version_info(version_name, version_code):
    """
    更新Android版本信息

    Args:
        version_name: 版本名称
        version_code: 版本号

    Return:

    Raises:
    """

    # Android工程，gradle.properties文件绝对路径
    path = '%s/gradle.properties' % andorid_path
    # 读取文件，修改相应版本信息
    f = open(path, mode='r')
    content = ''
    line = f.readline()
    print ('line' + line)
    while line:
        if line.startswith('APP_VERSION_NAME'):
            content += ('APP_VERSION_NAME=' + version_name + '\n')
        elif line.startswith('APP_VERSION_CODE'):
            content += ('APP_VERSION_CODE=' + version_code + '\n')
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


def update_ios_version_info(version_name, version_code):
    """
    更新IOS版本信息

    Args:
        version_name: 版本名称
        version_code: 版本号

    Return:

    Raises:
    """
    print 'ios版本信息有待更新'


def update_version_info(platform, version_name, version_code):
    """
    更新版本信息

    Args:
        platform: 平台，android、ios、all
        version_name: 版本名称
        version_code: 版本号

    Return:

    Raises:
    """
    if platform == 'android':
        update_android_version_info(version_name, version_code)
    elif platform == 'ios':
        update_ios_version_info(version_name, version_code)
    elif platform == 'all':
        update_android_version_info(version_name, version_code)
        update_ios_version_info(version_name, version_code)
    else:
        print '请检查你输入的platform'


def generate_pack_name(version_name, version_code, build_type):
    """
    生成包名

    Args:
        version_name: 版本名称
        version_code: 版本号
        build_type: 构建类型： dev、alpha、beta、rc

    Return:

    Raises:
    """
    pack_name_prefix = 'TalkTok'
    pack_name_suffix = 'apk'
    return '%s-%s-%s-%s-%s.%s' % (pack_name_prefix, version_name, version_code, build_type, 'debug' if build_type.startswith('dev') else 'release', pack_name_suffix)


def get_output_file_path(platform, build_type):
    """
    获取包输出路径

    Args:
        platform: 平台，android、ios、all
        build_type: 构建类型： dev、alpha、beta、rc

    Return:

    Raises:
    """
    if platform == 'android':
        category = 'debug' if build_type.startswith('dev') else 'release'
        return '%s/android/app/build/outputs/apk/%s/%s/app-%s-%s.apk' % (
            os.getcwd(), build_type, category, build_type, category)  # apk文件绝对路径
    elif platform == 'ios':
        return '不支持'
    else:
        print '请检查你输入的platform'
        return ''


def copy_output_file_to_dist(src_path, dist_path, apk_name):
    """
    拷贝生成包文件
    Args:
        src_path:  apk文件路径
        dst_path: 输出路径
        apk_name: 重命名apk

    Return:

    Raises:
    """
    print '*****************拷贝apk*****************'

    print 'src_path', src_path
    print 'dist_path', dist_path + '/' + apk_name

    if os.path.exists(dist_path):  # 文件夹存在
        shutil.copy2(src_path, dist_path)
        os.rename(dist_path + '/' + os.path.basename(src_path),
                  dist_path + '/' + apk_name)
    else:
        os.mkdir(dist_path)
        shutil.copy2(src_path, dist_path)
        os.rename(dist_path + '/' + os.path.basename(src_path),
                  dist_path + '/' + apk_name)


def android(build_type):
    """
    Android构建

    Args:
        build_type: 构建类型

    Return:

    Raises:
    """
    cmd = 'cd android && ./gradlew clean && ./gradlew assembleDevDebug'
    if build_type.startswith('dev'):
        cmd = 'cd android && ./gradlew clean && ./gradlew assembleDevDebug'
    elif build_type.startswith('alpha'):
      cmd = 'cd android && ./gradlew clean && ./gradlew assembleAlphaRelease'
    elif build_type.startswith('beta'):
        cmd = 'cd android && ./gradlew clean && ./gradlew assembleBetaRelease'
    elif build_type.startswith('rc'):
        cmd = 'cd android && ./gradlew clean && ./gradlew assembleRcRelease'
    else:
        print '请检查你输入的build_type'
    os.system(cmd)


def ios(build_type):
    """
    IOS构建

    Args:
        build_type: 构建类型

    Return:

    Raises:
    """
    print 'ios自动构建有待集成'


def start(platform, build_type):
    """
    构建

    Args:
        platform： 平台，android、ios、all
        build_type: 构建类型

    Return:

    Raises:
    """
    print '*****************开始构建*****************'
    if platform == 'android':
        android(build_type)
    elif platform == 'ios':
        ios(build_type)
    elif platform == 'all':
        android(build_type)
        ios(build_type)
    else:
        print '请检查你输入的platform'


def upload_to_pyger(apk_path, update_description):
    """
    上传蒲公英

    Args:
        apk_path: apk文件路径
        update_description: 更新说明

    Return: 第三方Api返回，应用下载链接、二维码链接

    Raises:
    """

    print '*****************上传蒲公英*****************'
    print '上传包路径：%s' % apk_path

    # 蒲公英用户Key
    pyger_user_key = 'f1677eb1b9b176c8cc256f6744710827'
    # 蒲公英API Key
    pyger_api_key = '6eb47d86d6a2ab6ae47c0f824f28c6a3'
    # 蒲公英，上传的应用的下载密码
    pyger_download_pwd = ''
    # 蒲公英上传Api
    pyger_upload_url = 'https://www.pgyer.com/apiv1/app/upload'

    # pyger文档：https://www.pgyer.com/doc/view/api#uploadApp
    pgyer_api = 'curl -F "file=@%s" -F "uKey=%s" -F "_api_key=%s" -F "installType=1" -F "password=%s" -F "updateDescription=%s" %s' % (
        apk_path, pyger_user_key, pyger_api_key, pyger_download_pwd, update_description, pyger_upload_url)
    # 使用os.popen()的方法运行curl
    result = os.popen(pgyer_api).readlines()
    result = json.loads(result[0])
    if result['code'] == 0:
        print '---上传蒲公英成功---'
        print(result)
        return result['data']
    else:
        print '---上传蒲公英失败---'
        return {}


def upload_to_fir(apk_path, update_description):
    """
    上传fir

    Args:
        apk_path: apk文件路径
        update_description: 更新说明

    Return: 第三方Api返回，应用下载链接、二维码链接

    Raises:
    """
    print '*****************上传fir*****************'
    api_token = '71a85dcf82010ed792c880819ab0fd03'
    fir_api = 'fir publish "%s" --changelog=%s --token=%s -Q' % (
        apk_path, update_description, api_token)
    result = ''
    try:
        result = os.popen(fir_api).readlines()
        print result
    except Exception:
        print '请安装fir.im-cli工具'
    if result:
        for index in range(len(result)):
            element = result[index]
            if element.find('Published succeed') != -1:
                element = re.findall(re.compile(
                    r'[a-zA-z]+://[^\s]*'), element)
                print '---上传fir成功---'
                print 'fir下载地址：%s' % element
                return element[0]
    return ''


def send_ding_talk(message):
    """
    发送钉钉通知

    Args:
        message 消息，文本类型

    Return: True：发送成功，False：发送失败

    Raises:
    """

    print '*****************发送钉钉*****************'

    # 钉钉机器人通知 for Kiosk Developer Team
    # ding_talk_api = 'https://oapi.dingtalk.com/robot/send?access_token=f76a4d942701319da3d60f6c2be940bdafc4d275aed158b9097b4bfe753bfd54'
    # # 钉钉机器人通知 for Unified Kiosk
    ding_talk_api = 'https://oapi.dingtalk.com/robot/send?access_token=0f39594cf1671218e643ccef7abcf8fffc4fdeae52dc8cc8b4af1e9dc475dbd6'

    # 这里只发送文字，如需要修改请前往查阅
    # https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.karFPe&treeId=257&articleId=105735&docType=1
    send_data = {"msgtype": "text", "text": {"content": message},
                 "at": {"atMobiles": ['+86-13682563566'], "isAtAll": False}}

    # 将字典类型数据转化为json格式
    send_data = json.dumps(send_data)

    # python3的Request要求data为byte类型
    send_data = send_data.encode("utf-8")

    # 请求头部
    header = {"Content-Type": "application/json", "Charset": "UTF-8"}

    # 发送请求
    request = urllib2.Request(
        url=ding_talk_api, data=send_data, headers=header)

    try:
        # 将请求发回的数据构建成为文件格式
        response = urllib2.urlopen(request)
        # 打印返回的结果
        print '---钉钉通知成功---'
        print(response.read())
        return True
    except urllib2.HTTPError, e:
        print '---钉钉通知失败---'
        print 'HTTPError = %s' % str(e.code)
        return False
    except urllib2.URLError, e:
        print '---钉钉通知失败---'
        print 'URLError = %s' % str(e.reason)
        return False
    except Exception:
        print '---钉钉通知失败---'
        print 'Unkown Exception'
        return False


def send_mail(receivers, mail_msg, attach_path):
    """
    发送邮件
    第三方 SMTP 服务, 这里使用 QQ

    Args:
        receivers: 邮件接收者，格式为['123@qq.com', '456@qq.com']
        mail_msg: 邮件内容，html字符串
        attach_path: 附件路径

    Return: True：发送成功，False：发送失败

    Raises:
    """

    print '*****************发送邮件*****************'

    mail_host = 'smtp.qq.com'  # 设置服务器
    mail_user = '865068275@qq.com'  # 用户名
    mail_pass = 'voersxvgouhbbbfg'  # 口令
    mail_sender = '865068275@qq.com'  # 发送者
    mail_from = 'Barry'  # 邮件的发件人
    mail_to = '测试部门'  # 邮件收件人
    mail_subject = 'TalkTok构建通知'  # 邮件标题

    # 发送纯文本
    # message = MIMEText('Python 邮件发送测试...', 'plain', 'utf-8')

    # 发送html
    # message = MIMEText(mail_msg, 'html', 'utf-8')

    # 发送带附件的html
    message = MIMEMultipart()
    message.attach(MIMEText(mail_msg, 'html', 'utf-8'))
    message['From'] = Header(mail_from, 'utf-8')
    message['To'] = Header(mail_to, 'utf-8')
    message['Subject'] = Header(mail_subject, 'utf-8')

    if attach_path:
        try:
            # 构造附件，传送apk文件
            pack = MIMEText(open(attach_path, 'rb').read(), 'base64', 'utf-8')
            pack["Content-Type"] = 'application/octet-stream'
            # 这里的filename，邮件中显示的名字
            pack["Content-Disposition"] = 'attachment; filename="%s"' % os.path.basename(
                attach_path)
            message.attach(pack)
        except Exception:
            print '附件不存在'
    else:
        print '邮件没有传送附件'

    try:
        smtpObj = smtplib.SMTP()
        smtpObj.connect(mail_host, 25)  # 25 为 SMTP 端口号，非ssl验证
        smtpObj.login(mail_user, mail_pass)
        smtpObj.sendmail(mail_sender, receivers, message.as_string())
        print ("---邮件发送成功---")
        return True
    except smtplib.SMTPException as err:
        print ("---邮件发送失败---")
        return False
    finally:
        smtpObj.quit()


def main():
    print '**************************************************************************************'
    print '*                                                                                    *'
    print '*                           Barry，欢迎您使用自动构建                          *'
    print '*                                                                                    *'
    print '**************************************************************************************'

    # 获取版本信息
    version_info = get_version_info()
    default_version_name = version_info['version_name']
    defalut_version_code = version_info['version_code']

    # Git分支，默认develop
    branch = sys.argv[1]
    if not branch:
        branch = 'develop'
    # 构建类型，选择 dev alpha beta rc，默认dev
    build_type = sys.argv[2]
    if not build_type:
        build_type = 'dev'
    # 平台，all android ios可选，默认all
    platform = sys.argv[3]
    if not platform:
        platform = 'all'
    # 版本名称，String，默认最近的版本名称
    version_name = sys.argv[4]
    if not version_name or version_name == 'latest':
        version_name = default_version_name
    # 版本号，Numbers，默认最近版本号
    version_code = sys.argv[5]
    if not version_code or version_code == 'latest':
        version_code = defalut_version_code
    # 是否上传至蒲公英，Boolean true false，默认false
    is_upload_pgyer = sys.argv[6]
    if not is_upload_pgyer or str(is_upload_pgyer).lower() == 'false':
        is_upload_pgyer = False
    # 是否上传fir，Boolean true false，默认false
    is_upload_fir = sys.argv[7]
    if not is_upload_fir or str(is_upload_fir).lower() == 'false':
        is_upload_fir = False
    if is_upload_pgyer or is_upload_fir:
        # 版本更新说明，String，默认空
        update_description = sys.argv[8]
        if not update_description or update_description == 'default':
            update_description = ''
        # 是否邮件通知， Boolean true false，默认false
        is_mail_notification = sys.argv[9]
        if not is_mail_notification or str(is_mail_notification).lower() == 'false':
            is_mail_notification = False
        if is_mail_notification:
            # 邮件接收者，以英文逗号分隔，例123@qq.com,456@sina.cn
            mail_receivers = sys.argv[10]
            if not mail_receivers or mail_receivers == 'default':
                print '请输入格式正确的邮箱'
                sys.exit(0)  # 中断程序
            for receiver in mail_receivers.split(','):
                if not re.match(r'^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}$', receiver):
                    print('请输入格式正确的邮箱')
                    sys.exit(0)  # 中断程序

        # 是否钉钉机器人通知，Boolean true false，默认false
        is_ding_talk_notification = sys.argv[11]
        if not is_ding_talk_notification or str(is_ding_talk_notification).lower() == 'false':
            is_ding_talk_notification = False

    # update_code(branch)  # 这是走Jenkins的Git插件更新
    config_env()
    update_version_info(platform, version_name, version_code)
    start(platform, build_type)
    src_path = get_output_file_path('android', build_type)
    apk_name = generate_pack_name(version_name, version_code, build_type)
    copy_output_file_to_dist(src_path, dist_path, apk_name)
    if is_upload_pgyer and is_upload_fir:
        apk_path = '%s/%s' % (dist_path, apk_name)  # apk路径
        app_info = upload_to_pyger(apk_path, update_description)
        pyger_download_url = 'https://www.pgyer.com/%s' % app_info['appShortcutUrl'].encode(
            'utf-8')  # 蒲公英短链接
        pyger_qrcode_url = app_info['appQRCodeURL'].encode(
            'utf-8')  # 蒲公英二维码url
        fir_download_url = upload_to_fir(
            apk_path, update_description)  # fim短链接
        if is_mail_notification and mail_receivers:
            mail_msg = """
              <p>Kiosk %s-%s 版本构建成功了...</p>
              <p>
                <img src="%s" />
                <p>1.扫描上方二维码下载，或者点击<a href="%s" target="_Blank">蒲公英</a>进行下载</p>
              </p>
              <p>2.点击<a href="%s" target="_Blank">fir</a>进行下载</p>
              <p>3.下载邮件提供的附件</p>
            """ % (version_name, version_code, pyger_qrcode_url, pyger_download_url, fir_download_url)
            send_mail(mail_receivers, mail_msg, apk_path)
        if is_ding_talk_notification:
            msg = "TalkTok %s-%s构建成功，如有需要请前往下载\n%s\n%s" % (
                version_name, version_code, pyger_download_url, fir_download_url)
            send_ding_talk(msg)
    elif is_upload_pgyer:
        apk_path = '%s/%s' % (dist_path, apk_name)  # apk路径
        app_info = upload_to_pyger(apk_path, update_description)
        pyger_download_url = 'https://www.pgyer.com/%s' % app_info['appShortcutUrl'].encode(
            'utf-8')  # 蒲公英短链接
        pyger_qrcode_url = app_info['appQRCodeURL'].encode(
            'utf-8')  # 蒲公英二维码url
        if is_mail_notification and mail_receivers:
            mail_msg = """
              <p>Kiosk %s-%s 版本构建成功了...</p>
              <img src="%s" />
              <p>您可以扫描二维码下载，或者<a href="%s" target="_Blank">点击此链接</a>进行下载，或者下载邮件提供的附件</p>
            """ % (version_name, version_code, pyger_qrcode_url, pyger_download_url)
            send_mail(mail_receivers, mail_msg, apk_path)
        if is_ding_talk_notification:
            msg = "TalkTok %s-%s构建成功，如有需要请前往下载\n%s" % (
                version_name, version_code, pyger_download_url)
            send_ding_talk(msg)
    elif is_upload_fir:
        apk_path = '%s/%s' % (dist_path, apk_name)  # apk路径
        fir_download_url = upload_to_fir(apk_path, update_description)
        if is_mail_notification and mail_receivers:
            mail_msg = """
              <p>Kiosk %s-%s 版本构建成功了...</p>
              <p>您可以<a href="%s" target="_Blank">点击此链接</a>进行下载，或者下载邮件提供的附件</p>
            """ % (version_name, version_code, fir_download_url)
            send_mail(mail_receivers, mail_msg, apk_path)
        if is_ding_talk_notification:
            msg = "TalkTok %s-%s构建成功，如有需要请前往下载\n%s" % (
                version_name, version_code, fir_download_url)
            send_ding_talk(msg)
    print '**************************************************************************************'
    print '*                                                                                    *'
    print '*                           Barry，感谢您使用自动构建                          *'
    print '*                                                                                    *'
    print '**************************************************************************************'


if __name__ == "__main__":
    main()

# example: python cli/builder/jenkins.py ${branch} ${build_type} ${platform} ${version_name} ${version_code} ${is_upload_pgyer} ${is_upload_fir} ${update_description} ${is_mail_notification} ${mail_receivers} ${is_ding_talk_notification}
# example: python cli/builder/jenkins.py development alpha android latest latest false false default false default false
