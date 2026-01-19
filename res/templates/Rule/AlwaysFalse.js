function AlwaysFalse() {
  return Promise.resolve().then(() => {
    return false;
  });
}

function AlwaysFalse2() {
  return false;
}

// export option #1 using default es5 syntax
module.exports.default = {AlwaysFalse};
// export option #2 using named es5 syntax
module.exports.AlwaysFalse2 = {AlwaysFalse2};