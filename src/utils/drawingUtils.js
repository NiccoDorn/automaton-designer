import { NODE_RADIUS, ACCEPTING_RADIUS } from '../constants';

export function drawSelfLoop(ctx, node, label, theme) {
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
    ctx.lineTo(
        arrowHeadX - 7 * Math.cos(arrowAngle - Math.PI / 4),
        arrowHeadY - 7 * Math.sin(arrowAngle - Math.PI / 4)
    );
    ctx.lineTo(
        arrowHeadX - 7 * Math.cos(arrowAngle + Math.PI / 4),
        arrowHeadY - 7 * Math.sin(arrowAngle + Math.PI / 4)
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.edgeLabel;
    ctx.fillText(label, loopCenterX, loopCenterY - loopRadius - 10);
}

export function drawEdge(ctx, fromNode, toNode, label, edges, currentEdge, theme) {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    const fromX = fromNode.x + NODE_RADIUS * Math.cos(angle);
    const fromY = fromNode.y + NODE_RADIUS * Math.sin(angle);
    const toX = toNode.x - NODE_RADIUS * Math.cos(angle);
    const toY = toNode.y - NODE_RADIUS * Math.sin(angle);

    const f = fromNode.id;
    const t = toNode.id;
    const forwardEdges = edges.filter(e => e.from === f && e.to === t);
    const backwardEdges = edges.filter(e => e.from === t && e.to === f);
    const forwardIndex = forwardEdges.findIndex(e => e.id === currentEdge.id);
    const isForward = forwardIndex !== -1;
    let curveSign = 0;
    let curveStrength = 0;

    if (forwardEdges.length === 1 && backwardEdges.length === 0) {
        curveSign = 0;
        curveStrength = 0;
    } else {
        curveSign = isForward ? 1 : -1;
        const sameDirEdges = isForward ? forwardEdges : backwardEdges;
        const indexInDir = sameDirEdges.findIndex(e => e.id === currentEdge.id);
        const baseCurv = 30;
        const increment = 35;
        curveStrength = baseCurv + indexInDir * increment;
    }

    ctx.beginPath();

    if (curveSign === 0) {
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        const arrowAngle = angle;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(arrowAngle - Math.PI / 6), toY - 10 * Math.sin(arrowAngle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(arrowAngle + Math.PI / 6), toY - 10 * Math.sin(arrowAngle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const labelAngle = angle + Math.PI / 2;
        const labelShift = 8;
        const labelX = midX + labelShift * Math.cos(labelAngle);
        const labelY = midY + labelShift * Math.sin(labelAngle);
        ctx.fillStyle = theme.edgeLabel;
        ctx.fillText(label, labelX, labelY);
        return;
    }

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const curveAngle = angle + curveSign * Math.PI / 2;
    const controlX = midX + curveStrength * Math.cos(curveAngle);
    const controlY = midY + curveStrength * Math.sin(curveAngle);

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
    
    ctx.fillStyle = theme.edgeLabel;
    ctx.fillText(label, shiftedLabelX, shiftedLabelY);
}

export function drawNode(ctx, node, { isSelected, isHovered, isEdgeStartNode, isSimulationActive }, theme) {
    if (node.isStart) {
        ctx.strokeStyle = theme.edge;
        ctx.lineWidth = 2;
        ctx.fillStyle = theme.edge;
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
        ctx.strokeStyle = isSelected ? theme.nodeSelected : (isSimulationActive ? '#f59e0b' : theme.nodeStroke);
        ctx.lineWidth = isSimulationActive ? 4 : 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, ACCEPTING_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
    }

    let simColor, simFill;
    if (isSimulationActive) {
        const isDarkTheme = theme.canvas.includes('1f') || theme.canvas.includes('0f');
        simColor = isDarkTheme ? '#fbbf24' : '#f59e0b';
        simFill = isDarkTheme ? '#fef3c7' : '#fde68a';
    }

    ctx.fillStyle = isSimulationActive ? simFill : (isEdgeStartNode ? '#fcd34d' : (isHovered ? theme.nodeHover : theme.node));
    ctx.strokeStyle = isSelected ? theme.nodeSelected : (isSimulationActive ? simColor : theme.nodeStroke);
    ctx.lineWidth = isSelected ? 4 : (isSimulationActive ? 4 : 2);
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isSimulationActive) {
        ctx.strokeStyle = simColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    ctx.fillStyle = theme.text;
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);
}