import { NODE_RADIUS, ACCEPTING_RADIUS } from '../constants';

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

export function drawEdge(ctx, fromNode, toNode, label) {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    
    const fromX = fromNode.x + NODE_RADIUS * Math.cos(angle);
    const fromY = fromNode.y + NODE_RADIUS * Math.sin(angle);
    const toX = toNode.x - NODE_RADIUS * Math.cos(angle);
    const toY = toNode.y - NODE_RADIUS * Math.sin(angle);

    ctx.beginPath();
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
    const labelX = midX + 10 * Math.cos(labelAngle);
    const labelY = midY + 10 * Math.sin(labelAngle);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(labelX - ctx.measureText(label).width/2 - 5, labelY - 10, ctx.measureText(label).width + 10, 20);
    ctx.fillStyle = '#1f2937';
    ctx.fillText(label, labelX, labelY);
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