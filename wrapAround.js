function map(n,or1,or2,r1,r2){return r1+(r2-r1)*((n-or1)/(or2-or1));}
function minmax(arr){
	var mins = arr[0][0];
	var maxs = arr[0][0];
	for(var i = 0; i<arr.length; i++){
		for(var j = 0; j<arr.length; j++){
			if(mins>arr[i][j]){mins=arr[i][j]}
			if(maxs<arr[i][j]){maxs=arr[i][j]}
		}
	}
	return [mins,maxs];
}
function randint(a,b){
	if(a>b){[a,b]=[b,a];}
	return Math.round(Math.random()*(b-a));
}
function set(size){
	var arr = [];
	for(var i = 0; i<2**size+1; i++){
		arr.push([]);
		for(var j = 0; j<2**size+1; j++){
			arr[i].push(null);
		}
	}
	return arr;
}
function gen(arr){
	for(var i = 0; i<arr.length; i++){
		arr[0][i]=0;
		arr[arr.length-1][i]=0;
	}
	var size = arr.length-1;
	var h = 50;
	while(size>1){
		for(var j = 0; j<arr.length-1; j+=size){
			for(var k = 0; k<arr.length-1; k+=size){
				var tl = arr[j][k];
				var tr = arr[j][k+size];
				var bl = arr[j+size][k];
				var br = arr[j+size][k+size];
				arr[j+size/2][k+size/2]=arr[j+size/2][k+size/2]!==null?arr[j+size/2][k+size/2]:Math.round((tl+tr+bl+br)/4+(Math.random()*h-h/2));
			}
		}
		for(var j = 0; j<=arr.length-1; j+=size/2){
			for(var k = 0; k<=arr.length-1; k+=size/2){
				if(arr[j][k]===null){
					var t = j-size/2<0?arr[arr.length-1+(j-size/2)][k]:arr[j-size/2][k];
					var b = j+size/2>arr.length-1?arr[j+size/2-arr.length+1][k]:arr[j+size/2][k];
					var l = k-size/2<0?arr[j][arr.length-1+(k-size/2)]:arr[j][k-size/2];
					var r = k+size/2>arr.length-1?arr[j][k+size/2-arr.length+1]:arr[j][k+size/2];
					if(arr[j][k]===null){
						if(k==arr.length-1){arr[j][k]=arr[j][0];}
						else if(j==arr.length-1){arr[j][k]=arr[0][k];}
						else{arr[j][k] = Math.round([t,b,l,r].reduce((a,i)=>a+(i!==null?i:0),0)/4+(Math.random()*h-h/2));}
					}
				}
			}
		}
		h/=2;
		size/=2;
	}
	return arr;
}
