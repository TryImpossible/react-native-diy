//
//  App1Controller.m
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "App1Controller.h"
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCTBridge+LoadJS.h"
#import <React/RCTBridge+Private.h>

@interface App1Controller ()

@end

@implementation App1Controller

- (JSBundleBean *)getLoaderType {
  return [[JSBundleBean alloc] initWithLoaderType: LoaderTypeASSET url:@"app1.ios.bundle"];
}

- (NSString *)getMainComponentName {
  return @"app1";
}

@end
