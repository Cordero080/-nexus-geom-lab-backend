// Compound Tesseract Visualization
// Creates a proper compound tesseract with nested structure

class CompoundTesseract {
  constructor() {
    this.outerVertices = [];
    this.innerVertices = [];
    this.outerEdges = [];
    this.innerEdges = [];
    this.edgeConnections = [];
    this.hyperframeConnections = [];
  }

  // Generate vertices for a single tesseract in 4D space
  generateTesseractVertices(scale = 1, offset = [0, 0, 0, 0]) {
    const vertices = [];
    // Generate all 16 vertices of a tesseract (2^4 combinations)
    for (let i = 0; i < 16; i++) {
      const vertex = [
        ((i & 1) ? 1 : -1) * scale + offset[0],
        ((i & 2) ? 1 : -1) * scale + offset[1],
        ((i & 4) ? 1 : -1) * scale + offset[2],
        ((i & 8) ? 1 : -1) * scale + offset[3]
      ];
      vertices.push(vertex);
    }
    return vertices;
  }

  // Create compound tesseract by merging two rotated tesseracts
  createCompoundTesseract(scale, rotation = 0) {
    const tesseract1 = this.generateTesseractVertices(scale);
    const tesseract2 = this.rotateTesseract(
      this.generateTesseractVertices(scale), 
      rotation
    );
    
    // Merge vertices (remove duplicates within tolerance)
    const merged = this.mergeVertices([...tesseract1, ...tesseract2]);
    return merged;
  }

  // Rotate tesseract in 4D space
  rotateTesseract(vertices, angle) {
    // Apply 4D rotation matrix
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    return vertices.map(v => {
      // Rotate in XW and YZ planes for compound effect
      const x = v[0] * cos - v[3] * sin;
      const y = v[1] * cos - v[2] * sin;
      const z = v[1] * sin + v[2] * cos;
      const w = v[0] * sin + v[3] * cos;
      return [x, y, z, w];
    });
  }

  // Merge vertices that are very close (within tolerance)
  mergeVertices(vertices, tolerance = 0.01) {
    const merged = [];
    const used = new Set();
    
    vertices.forEach((v1, i) => {
      if (used.has(i)) return;
      
      merged.push(v1);
      
      vertices.forEach((v2, j) => {
        if (i !== j && !used.has(j)) {
          const dist = this.distance4D(v1, v2);
          if (dist < tolerance) {
            used.add(j);
          }
        }
      });
    });
    
    return merged;
  }

  // Calculate 4D distance
  distance4D(v1, v2) {
    return Math.sqrt(
      Math.pow(v1[0] - v2[0], 2) +
      Math.pow(v1[1] - v2[1], 2) +
      Math.pow(v1[2] - v2[2], 2) +
      Math.pow(v1[3] - v2[3], 2)
    );
  }

  // Project 4D point to 3D
  project4Dto3D(vertex, distance = 3) {
    const w = vertex[3];
    const scale = distance / (distance + w);
    return [
      vertex[0] * scale,
      vertex[1] * scale,
      vertex[2] * scale
    ];
  }

  // Generate edges for tesseract (connect vertices that differ by 1 bit)
  generateTesseractEdges(vertices) {
    const edges = [];
    
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        // Check if vertices are adjacent (differ in exactly one coordinate)
        const dist = this.distance4D(vertices[i], vertices[j]);
        
        // Adjacent vertices in a tesseract are distance 2*scale apart
        if (Math.abs(dist - 2.0) < 0.1) {
          edges.push([i, j]);
        }
      }
    }
    
    return edges;
  }

  // Create green edge lines connecting inner to outer
  createEdgeConnections() {
    const connections = [];
    
    // Connect each inner vertex to nearest outer vertices
    this.innerVertices.forEach((innerV, innerIdx) => {
      // Find corresponding vertices in outer structure
      const nearestOuter = this.findNearestVertices(
        innerV, 
        this.outerVertices, 
        4 // Connect to 4 nearest
      );
      
      nearestOuter.forEach(outerIdx => {
        connections.push([innerIdx, outerIdx]);
      });
    });
    
    return connections;
  }

  // Find k nearest vertices
  findNearestVertices(vertex, vertices, k) {
    const distances = vertices.map((v, idx) => ({
      idx,
      dist: this.distance4D(vertex, v)
    }));
    
    distances.sort((a, b) => a.dist - b.dist);
    return distances.slice(0, k).map(d => d.idx);
  }

  // Create dense hyperframe connections within inner structure
  createHyperframe(maxDistance = 2.5) {
    const connections = [];
    
    // Connect vertices within certain distance threshold
    for (let i = 0; i < this.innerVertices.length; i++) {
      for (let j = i + 1; j < this.innerVertices.length; j++) {
        const dist = this.distance4D(
          this.innerVertices[i], 
          this.innerVertices[j]
        );
        
        if (dist <= maxDistance) {
          connections.push([i, j]);
        }
      }
    }
    
    return connections;
  }

  // Build the complete structure
  build() {
    // Create outer compound tesseract
    const outerRotation = Math.PI / 4; // 45 degree rotation
    this.outerVertices = this.createCompoundTesseract(2.0, outerRotation);
    this.outerEdges = this.generateTesseractEdges(this.outerVertices);
    
    // Create inner compound tesseract (smaller, same construction)
    this.innerVertices = this.createCompoundTesseract(1.0, outerRotation);
    this.innerEdges = this.generateTesseractEdges(this.innerVertices);
    
    // Create connections
    this.edgeConnections = this.createEdgeConnections();
    this.hyperframeConnections = this.createHyperframe();
  }

  // Render to Three.js scene
  renderToScene(scene) {
    // Materials
    const outerMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
    const innerMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    
    // Render outer structure
    this.renderEdges(scene, this.outerVertices, this.outerEdges, outerMaterial);
    
    // Render inner structure
    this.renderEdges(scene, this.innerVertices, this.innerEdges, innerMaterial);
    
    // Render edge connections
    this.renderConnections(
      scene, 
      this.innerVertices, 
      this.outerVertices, 
      this.edgeConnections, 
      edgeMaterial
    );
    
    // Render hyperframe
    this.renderEdges(
      scene, 
      this.innerVertices, 
      this.hyperframeConnections, 
      innerMaterial
    );
  }

  renderEdges(scene, vertices, edges, material) {
    edges.forEach(([i, j]) => {
      const v1 = this.project4Dto3D(vertices[i]);
      const v2 = this.project4Dto3D(vertices[j]);
      
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...v1),
        new THREE.Vector3(...v2)
      ]);
      
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });
  }

  renderConnections(scene, innerVerts, outerVerts, connections, material) {
    connections.forEach(([innerIdx, outerIdx]) => {
      const v1 = this.project4Dto3D(innerVerts[innerIdx]);
      const v2 = this.project4Dto3D(outerVerts[outerIdx]);
      
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...v1),
        new THREE.Vector3(...v2)
      ]);
      
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });
  }
}

// Usage
const compound = new CompoundTesseract();
compound.build();
compound.renderToScene(scene);