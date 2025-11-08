import { NODE_RADIUS, ACCEPTING_RADIUS } from '../constants';

function getEdgeCurveIndex(fromNodeId, toNodeId, currentEdgeId, edges) {
    const parallelEdges = edges.filter(e => e.from === fromNodeId && e.to === toNodeId);
    parallelEdges.sort((a, b) => a.id - b.id);

    const index = parallelEdges.findIndex(e => e.id === currentEdgeId);
    return {
        index: index,
        count: parallelEdges.length
    };
}

export function drawSelfLoop(ctx, node, label) {
    const loopRadius = 20;
    const offset = ACCEPTING_RADIUS + 5;
    const loopCenterX = node.x;
    const loopCenterY = node.y - offset;
    const arrowAngle = Math.PI * 0.7;

    ctx.beginPath();
    ctx.arc(loopCenterX, loopCenterY, loopRadius, Math.PI * 0.6, Math.PI * 2.4);
    ctx.stroke();

    const arrowHeadX = loopCenterX - loopRadius * Math.cos(arrowAngle);
    const arrowHeadY = loopCenterY - loopRadius * Math.sin(arrowAngle);
    ctx.beginPath();
    ctx.moveTo(arrowHeadX, arrowHeadY);
    ctx.lineTo(arrowHeadX - 7 * Math.cos(arrowAngle - Math.PI / 4), arrowHeadY - 7 * Math.sin(arrowAngle - Math.PI / 4));
    ctx.lineTo(arrowHeadX - 7 * Math.cos(arrowAngle + Math.PI / 4), arrowHeadY - 7 * Math.sin(arrowAngle + Math.PI / 4));
    ctx.closePath();
    ctx.fill();

    ctx.fillText(label, loopCenterX, loopCenterY - loopRadius - 10);
}

export function drawEdge(ctx, fromNode, toNode, label, edges, currentEdge) {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    const fromX = fromNode.x + NODE_RADIUS * Math.cos(angle);
    const fromY = fromNode.y + NODE_RADIUS * Math.sin(angle);
    const toX = toNode.x - NODE_RADIUS * Math.cos(angle);
    const toY = toNode.y - NODE_RADIUS * Math.sin(angle);
    
    const hasReverseEdge = edges.some(e => e.from === toNode.id && e.to === fromNode.id);
    const { index, count } = getEdgeCurveIndex(fromNode.id, toNode.id, currentEdge.id, edges);
    
    const curveIncrement = 35;
    const baseCurvature = hasReverseEdge ? 10 : 5;
    const indexMagnitude = index + 1;
    const finalCurveOffset = baseCurvature + indexMagnitude * curveIncrement;
    const centerIndex = (count - 1) / 2;
    const symmetricIndex = index - centerIndex;
    
    let curveDirectionSign = 1;
    
    if (count > 1 && !hasReverseEdge) {
        curveDirectionSign = Math.sign(symmetricIndex) || 1;
    }
    
    const needsCurve = hasReverseEdge || count > 1;

    ctx.beginPath();

    if (needsCurve) {
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const curveAngle = angle + Math.PI / 2 * curveDirectionSign;
        const controlX = midX + finalCurveOffset * Math.cos(curveAngle);
        const controlY = midY + finalCurveOffset * Math.sin(curveAngle);

        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(controlX, controlY, toX, toY);
        ctx.stroke();

        const arrowAngle = Math.atan2(toY - controlY, toX - controlX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(arrowAngle - Math.PI / 6), toY - 10 * Math.sin(arrowAngle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(arrowAngle + Math.PI / 6), toY - 10 * Math.sin(arrowAngle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        
        const labelMidpointX = 0.25 * fromX + 0.5 * controlX + 0.25 * toX;
        const labelMidpointY = 0.25 * fromY + 0.5 * controlY + 0.25 * toY;
        const tangentX = toX - fromX;
        const tangentY = toY - fromY;
        const tangentAngle = Math.atan2(tangentY, tangentX);
        const perpendicularAngle = tangentAngle + Math.PI / 2;
        const labelShift = 8;
        const shiftedLabelX = labelMidpointX + labelShift * Math.cos(perpendicularAngle);
        const shiftedLabelY = labelMidpointY + labelShift * Math.sin(perpendicularAngle);
        
        ctx.fillStyle = '#1f2937';
        ctx.fillText(label, shiftedLabelX, shiftedLabelY);
    }
    else {
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const labelAngle = angle + Math.PI / 2;
        const labelShift = 8;
        const labelX = midX + labelShift * Math.cos(labelAngle);
        const labelY = midY + labelShift * Math.sin(labelAngle);

        ctx.fillStyle = '#1f2937';
        ctx.fillText(label, labelX, labelY);
    }
}


export function drawNode(ctx, node, { isSelected, isHovered, isEdgeStartNode }) {
    if (node.isStart) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#374151';
        const startX = node.x - ACCEPTING_RADIUS - 20;
        const endX = node.x - ACCEPTING_RADIUS;
        ctx.beginPath();
        ctx.moveTo(startX, node.y);
        ctx.lineTo(endX, node.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX, node.y);
        ctx.lineTo(endX - 8, node.y - 5);
        ctx.lineTo(endX - 8, node.y + 5);
        ctx.closePath();
        ctx.fill();
    }

    if (node.isAccepting) {
        ctx.strokeStyle = isSelected ? '#3b82f6' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, ACCEPTING_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.fillStyle = isEdgeStartNode ? '#fcd34d' : (isHovered ? '#e5e7eb' : '#f9fafb');
    ctx.strokeStyle = isSelected ? '#3b82f6' : '#64748b';
    ctx.lineWidth = isSelected ? 4 : 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);
}