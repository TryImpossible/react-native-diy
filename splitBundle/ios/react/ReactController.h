//
//  ReactController.h
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JSBundleBean.h"

NS_ASSUME_NONNULL_BEGIN

@interface ReactController : UIViewController

- (JSBundleBean *) getLoaderType;

- (NSString *) getMainComponentName;

- (NSDictionary *) getInitialProperties;

@end

NS_ASSUME_NONNULL_END
