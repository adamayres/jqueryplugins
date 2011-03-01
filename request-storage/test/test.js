module("Request Storage Test");
			
test("requestStorage.setItem() - simple add", function() {
	expect(1);
	
	requestStorage.setItem("foo", "bar");
	requestStorage.setItem("baz", "lala");
	
	strictEqual(requestStorage.length, 2,
			"Expected length was 2, but was actually: [" + requestStorage.length + "]");
			
	requestStorage.clear();
});

test("requestStorage.getItem() - simple get", function() {
	expect(1);
	
	requestStorage.setItem("foo", "bar");
	var result = requestStorage.getItem("foo");
	
	strictEqual(result, "bar",
			"Expected value was \"bar\", but was actually: [" + result + "]");
			
	requestStorage.clear();
});

test("requestStorage.removeItem() - simple remove", function() {
	expect(1);
	
	requestStorage.setItem("foo", "bar");
	requestStorage.removeItem("foo");
	
	strictEqual(requestStorage.length, 0,
			"Expected length was 0, but was actually: [" + requestStorage.length + "]");
			
	requestStorage.clear();
});

test("requestStorage.clear() - clear", function() {
	expect(2);
	
	requestStorage.setItem("foo", "bar");
	
	strictEqual(requestStorage.length, 1,
			"Expected length was 1, but was actually: [" + requestStorage.length + "]");
	
	requestStorage.clear();
	
	strictEqual(requestStorage.length, 0,
			"Expected length was 0, but was actually: [" + requestStorage.length + "]");
			
	requestStorage.clear();
});

test("requestStorage.length - length", function() {
	expect(5);
	
	strictEqual(requestStorage.length, 0,
			"Expected length was 0, but was actually: [" + requestStorage.length + "]");
	
	requestStorage.setItem("foo", "bar");
	requestStorage.setItem("foo", "bar");
	
	strictEqual(requestStorage.length, 1,
			"Expected length was 1, but was actually: [" + requestStorage.length + "]");
	
	requestStorage.removeItem("does-not-exist", "foobar");
	requestStorage.removeItem("does-not-exist", "foobar");
	
	strictEqual(requestStorage.length, 1,
			"Expected length was 1, but was actually: [" + requestStorage.length + "]");
	
	requestStorage.setItem("dog", "golden ret");
	requestStorage.setItem("dog", "poodle");
	
	strictEqual(requestStorage.length, 2,
			"Expected length was 2, but was actually: [" + requestStorage.length + "]");
			
	requestStorage.removeItem("dog");
	requestStorage.removeItem(null);
	
	strictEqual(requestStorage.length, 1,
			"Expected length was 1, but was actually: [" + requestStorage.length + "]");
	
	requestStorage.clear();
});

test("requestStorage.key() - key", function() {
	expect(10);
	
	requestStorage.setItem("foo", "bar");
	
	var key = requestStorage.key(1);
	
	strictEqual(key, "foo",
			"Expected key was \"foo\", but was actually: [" + key + "]");
			
	key = requestStorage.key(0);
	
	var nullKeys = [-1, 2, "foo", true, false, {key: 1}, null, undefined, ""];
	
	for (var i = 0; i < nullKeys.length; i++) {
		key = requestStorage.key(nullKeys[i]);
		strictEqual(key, null,
			"Expected key was null, but was actually: [" + key + "]");
	}
	
	requestStorage.clear();
});