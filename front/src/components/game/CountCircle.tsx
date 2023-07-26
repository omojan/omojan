import { SVGAttributes, useMemo } from "react";

type Props = Readonly<{
	color: SVGAttributes<SVGCircleElement>["stroke"];
	r: number; // 半径
	strokeWidth: number; //border太さ
	maxValue: number;
	value: number;
}>;

export function CountCircle(props: Props) {
	/**
	 * SVGのwidthとheightとなるサイズ
	 */
	const size = useMemo(() => {
		return props.r * 2;
	}, [props.r]);

	/**
	 * strokeWidthを考慮した半径
	 */
	const r = useMemo(() => {
		return props.r - props.strokeWidth / 2;
	}, [props.r, props.strokeWidth]);

	/**
	 * 円周
	 */
	const circumference = useMemo(() => {
		return 2 * Math.PI * props.r;
	}, [props.r]);

	/**
	 * 表示する円周の長さ
	 */
	const dashoffset = useMemo(() => {
		return circumference * ((props.maxValue - props.value) / props.maxValue);
	}, [circumference, props.value]);

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			// className="absolute -translate-x-px"
			style={{
				position: "absolute",
				transform: "translate(-3px , -2.5px) rotate(-90deg) scale(1, -1)",
			}}
		>
			<circle
				r={props.r}
				cx={props.r}
				cy={props.r}
				stroke={props.color}
				fill="transparent"
				strokeWidth={props.strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={dashoffset}
			/>
			{/* {props.children} */}
		</svg>
	);
}
