//
//  ReactController.m
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "ReactController.h"
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCTBridge+LoadJS.h"
#import <React/RCTBridge+Private.h>

@interface ReactController ()

@end

@implementation ReactController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  
  AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
  
  JSBundleBean *jsBundle = [self getLoaderType];
  if (jsBundle != nil) {
    #if DEBUG
    app.bridge = [[RCTBridge alloc] initWithBundleURL:[[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil] moduleProvider:nil launchOptions:nil];
    #else
       NSRange range = [jsBundle.url rangeOfString:@"." options:NSBackwardsSearch];
       NSString *fileName = [jsBundle.url substringToIndex:range.location];
       NSString *extension = [jsBundle.url substringFromIndex:range.location + 1];
       NSData *sourceCode = [[NSData alloc] initWithContentsOfURL:[[NSBundle mainBundle] URLForResource:fileName withExtension:extension]];
       [app.bridge.batchedBridge executeSourceCode:sourceCode sync:YES];
    #endif
   
  }
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:app.bridge moduleName: [self getMainComponentName] initialProperties: [self getInitialProperties]];
  
  [self setView:rootView];
}

- (JSBundleBean *) getLoaderType {
  return nil;
}

- (NSString *) getMainComponentName {
  return nil;
}

- (NSDictionary *) getInitialProperties {
  return nil;
}

@end
