//
//  App2Controller.m
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "App2Controller.h"

@interface App2Controller ()

@end

@implementation App2Controller

- (JSBundleBean *)getLoaderType {
  return [[JSBundleBean alloc] initWithLoaderType: LoaderTypeASSET url:@"app2.ios.bundle"];
}

- (NSString *)getMainComponentName {
  return @"app2";
}

@end
