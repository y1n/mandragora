import grammy from 'grammy';
/**
 * 
 * @param {grammy.Context} ctx 
 * @param {grammy.NextFunction} next 
 */
export default function(ctx, next) {
    if (ctx.from.is_bot) return;
    return next();
}