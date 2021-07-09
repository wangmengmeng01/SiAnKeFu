export function url (rule, value, callback){
  if (!new RegExp('[a-zA-z]+://[^\\s]*').test(value)) {
    callback(new Error('请输入正确跳转链接'));
  }else {
  	callback();
  }
};
export function height(rule, value, callback) {
  if (value === "" || value >= 120) {
  	callback();
  }else {
    callback(new Error('不少于120的正整数'));
  }
}
export function weight(rule, value, callback) {
  if (value === "" || value >= 30) {
  	callback();
  }else {
    callback(new Error('不少于30的正整数'));
  }
}
