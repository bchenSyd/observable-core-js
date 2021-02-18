"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "Observable.prototype has a subscribe property": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable.prototype, "subscribe", {
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Argument type": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var x = new Observable(function (sink) {
      return null;
    });

    test._("Any value passed as observer will not cause subscribe to throw").not()["throws"](function (_) {
      return x.subscribe(null);
    }).not()["throws"](function (_) {
      return x.subscribe(undefined);
    }).not()["throws"](function (_) {
      return x.subscribe(1);
    }).not()["throws"](function (_) {
      return x.subscribe(true);
    }).not()["throws"](function (_) {
      return x.subscribe("string");
    }).not()["throws"](function (_) {
      return x.subscribe({});
    }).not()["throws"](function (_) {
      return x.subscribe(Object(1));
    }).not()["throws"](function (_) {
      return x.subscribe(function () {});
    });
  },
  "Function arguments": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var list = [],
        error = new Error();
    new Observable(function (s) {
      s.next(1);
      s.error(error);
    }).subscribe(function (x) {
      return list.push("next:" + x);
    }, function (e) {
      return list.push(e);
    }, function (x) {
      return list.push("complete:" + x);
    });
    new Observable(function (s) {
      s.complete();
    }).subscribe(function (x) {
      return list.push("next:" + x);
    }, function (e) {
      return list.push(e);
    }, function (x) {
      return list.push("complete");
    });

    test._("First argument is next callback").equals(list[0], "next:1")._("Second argument is error callback").equals(list[1], error)._("Third argument is complete callback").equals(list[2], "complete");

    list = [];

    test._("Second and third arguments are optional").not()["throws"](function () {
      return new Observable(function (s) {
        s.next(1);
        s.complete();
      }).subscribe(function (x) {
        return list.push("next:" + x);
      });
    }).equals(list, ["next:1"]);
  },
  "Subscriber arguments": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var observer = null;
    new Observable(function (x) {
      observer = x;
    }).subscribe({});

    test._("Subscriber is called with an observer").equals(typeof observer, "object").equals(typeof observer.next, "function").equals(typeof observer.error, "function").equals(typeof observer.complete, "function");

    test._("Subscription observer's constructor property is Object").equals(observer.constructor, Object);
  },
  "Subscriber return types": function (test, _ref5) {
    var Observable = _ref5.Observable;
    var type = "",
        sink = {};

    test._("Undefined can be returned").not()["throws"](function (_) {
      return new Observable(function (sink) {
        return undefined;
      }).subscribe(sink);
    })._("Null can be returned").not()["throws"](function (_) {
      return new Observable(function (sink) {
        return null;
      }).subscribe(sink);
    })._("Functions can be returned").not()["throws"](function (_) {
      return new Observable(function (sink) {
        return function () {};
      }).subscribe(sink);
    })._("Subscriptions can be returned").not()["throws"](function (_) {
      return new Observable(function (sink) {
        return {
          unsubscribe: function () {}
        }.subscribe(sink);
      });
    })._("Non callable, non-subscription objects cannot be returned")["throws"](function (_) {
      var error;
      new Observable(function (sink) {
        return {};
      }).subscribe({
        error: function (e) {
          error = e;
        }
      });
      throw error;
    }, TypeError)._("Non-functions cannot be returned")["throws"](function (_) {
      var error;
      new Observable(function (sink) {
        return 0;
      }).subscribe({
        error: function (e) {
          error = e;
        }
      });
      throw error;
    }, TypeError)["throws"](function (_) {
      var error;
      new Observable(function (sink) {
        return false;
      }).subscribe({
        error: function (e) {
          error = e;
        }
      });
      throw error;
    }, TypeError);
  },
  "Returns a subscription object": function (test, _ref6) {
    var Observable = _ref6.Observable;
    var called = 0;
    var subscription = new Observable(function (observer) {
      return function (_) {
        return called++;
      };
    }).subscribe({});
    var proto = Object.getPrototypeOf(subscription);
    testMethodProperty(test, proto, "unsubscribe", {
      configurable: true,
      writable: true,
      length: 0
    });
    testMethodProperty(test, proto, "closed", {
      get: true,
      configurable: true,
      writable: true,
      length: 0
    });

    test._("Subscribe returns an object").equals(typeof subscription, "object")._("Contructor property is Object").equals(subscription.constructor, Object)._("closed property returns false before unsubscription").equals(subscription.closed, false)._("Unsubscribe returns undefined").equals(subscription.unsubscribe(), undefined)._("Unsubscribe calls the cleanup function").equals(called, 1)._("closed property is true after calling unsubscribe").equals(subscription.closed, true);
  },
  "Cleanup function": function (test, _ref7) {
    var Observable = _ref7.Observable;
    var called = 0,
        returned = 0;
    var subscription = new Observable(function (sink) {
      return function (_) {
        called++;
      };
    }).subscribe({
      complete: function () {
        returned++;
      }
    });
    subscription.unsubscribe();

    test._("The cleanup function is called when unsubscribing").equals(called, 1);

    subscription.unsubscribe();

    test._("The cleanup function is not called again when unsubscribe is called again").equals(called, 1);

    called = 0;
    new Observable(function (sink) {
      sink.error(1);
      return function (_) {
        called++;
      };
    }).subscribe({
      error: function () {}
    });

    test._("The cleanup function is called when an error is sent to the sink").equals(called, 1);

    called = 0;
    new Observable(function (sink) {
      sink.complete(1);
      return function (_) {
        called++;
      };
    }).subscribe({
      next: function () {}
    });

    test._("The cleanup function is called when a complete is sent to the sink").equals(called, 1);

    var unsubscribeArgs = null;
    called = 0;
    subscription = new Observable(function (sink) {
      return {
        unsubscribe: function () {
          called = 1;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          unsubscribeArgs = args;
        }
      };
    }).subscribe({
      next: function () {}
    });
    subscription.unsubscribe(1);

    test._("If a subscription is returned, then unsubscribe is called on cleanup").equals(called, 1)._("Arguments are not forwarded to the unsubscribe function").equals(unsubscribeArgs, []);
  },
  "Exceptions thrown from the subscriber": function (test, _ref8) {
    var Observable = _ref8.Observable;
    var error = new Error(),
        observable = new Observable(function (_) {
      throw error;
    });

    test._("Subscribe does not throw if the observer does not handle errors").not()["throws"](function (_) {
      return observable.subscribe({});
    }, error);

    var thrown = null;

    test._("Subscribe does not throw if the observer has an error method").not()["throws"](function (_) {
      observable.subscribe({
        error: function (e) {
          thrown = e;
        }
      });
    });

    test._("Subscribe sends an error to the observer").equals(thrown, error);
  },
  "Start method": function (test, _ref9) {
    var Observable = _ref9.Observable;
    var events = [];
    var observable = new Observable(function (observer) {
      events.push("subscriber");
      observer.complete();
    });
    var observer = {
      startCalls: 0,
      thisValue: null,
      subscription: null,
      start: function (subscription) {
        events.push("start");
        observer.startCalls++;
        observer.thisValue = this;
        observer.subscription = subscription;
      }
    };
    var subscription = observable.subscribe(observer);

    test._("If the observer has a start method, it is called").equals(observer.startCalls, 1)._("Start is called with the observer as the this value").equals(observer.thisValue, observer)._("Start is called with the subscription as the first argument").equals(observer.subscription, subscription)._("Start is called before the subscriber function is called").equals(events, ["start", "subscriber"]);

    events = [];
    observer = {
      start: function (subscription) {
        events.push("start");
        subscription.unsubscribe();
      }
    };
    subscription = observable.subscribe(observer);

    test._("If unsubscribe is called from start, the subscriber is not called").equals(events, ["start"]);
  }
};