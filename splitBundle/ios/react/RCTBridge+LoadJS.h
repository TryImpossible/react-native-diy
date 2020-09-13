//
//  RCTBridge+LoadJS.h
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTBridge (LoadJS) // RN私有类 ，这里暴露他的接口

- (void)executeSourceCode:(NSData *)sourceCode sync:(BOOL)sync;

@end

NS_ASSUME_NONNULL_END
