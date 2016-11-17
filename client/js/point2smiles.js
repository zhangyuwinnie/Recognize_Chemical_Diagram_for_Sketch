
 //这个函数把所有的输入点转化为smiles 分子字符串表达式
 //在该函数前，应该有preprocess过程

 function p2s(matrix){
    var len = matrix.length;
    // construct vertices and initialization
    var nodes=[];
    for (var i= 0; i < len; i++){
        nodes[i] = new Node(i);

        // put each vertices neighbours into array
        for (var j = 0; j<len; j++){
            if (matrix[i][j]>0){
                nodes[i].neighbour.push(j);
            }
        }
        console.log("node"+i+":"+nodes[i].data+" "+nodes[i].neighbour);
    }
    //nodes[2].neighbour = nodes[2].neighbour.deleteElem(1);
    //console.log("node"+2+":"+nodes[2].data+" "+nodes[2].neighbour);

    //pick a source node
    var min = Infinity;
    var s = 0;
    for (var i= 0; i < len; i++){
        sum = 0;
        for (var j = 0; j<len; j++){
            sum+= matrix[i][j];

        }
        if (min > sum){
            min = sum;
            s = i;
        }
    }
    console.log("source "+s);

    // call DFS to get traverse records formula information and cycle information
    var d=0;
    var traverse = [];
    var cycle = [];
    DFS(nodes,nodes[s],d,traverse,cycle);
    console.log("traverse"+traverse);
    console.log("cycle:"+cycle);



     return "CCCC(C(C)C)CC";
 }


 // parameters are sets of vertices, source node, distance(not used at last), traverse-of-formula(in array), cycles(in array)
 function DFS(nodes, u, d, traverse,cycle){

    u.color = "grey";

    console.log("u: "+u.data);
    d++;
    u.distance = d;
    //console.log("u.distance:"+u.distance);



    for (var i =0; i<u.neighbour.length;i++){

        console.log("u+neighbour:"+u.data);

        // get an array of vertices whose child is being checked
        if (u.data != traverse[traverse.length-1]){
            traverse.push(u.data);
        }


        if (nodes[u.neighbour[i]].color == "white"){

            nodes[u.neighbour[i]].parent = u;

            // recursivly call DFS
            DFS(nodes,nodes[u.neighbour[i]],d,traverse,cycle);

        }
        // meet a cycle
        else
        {   // condition of meet a cycle(source node was involved)
            if (u.parent==null && nodes[u.neighbour[i]].color == "grey" ){
                //console.log("meet a ring of "+ring);
                console.log(u.data+" "+u.neighbour[i]+"form a ring");
                //var ring = u.distance-nodes[i].distance;

                var add = [u.data,u.neighbour[i]].sort();
                cycle.push(add);


            }
            // condition of meet a cycle(source node was not involved)
            else if(nodes[u.neighbour[i]].color == "grey" && u.neighbour[i] != u.parent.data){
                //console.log("meet a ring of "+ring);
                console.log(u.data+" "+u.neighbour[i]+"form a ring");
                //var ring = u.distance-nodes[i].distance;

                var add = [u.data,u.neighbour[i]].sort();
                cycle.push(add);
            }


        }

    }



 }

 function Node(data) {
    this.data = data;
    this.color = "white";
    this.parent = null;
    this.neighbour = [];
    this.distance = 0;
}





