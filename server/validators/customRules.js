'use strict';

export const ensureDateIsNotPast = (value) => {
        const now = new Date();
        if (value < now) {
                throw new Error('Due date may not be in the past');
        }
        return true;
};
