import SolidCard from "@/components/Cards/SolidCard";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Home = () => {

  return (
    <div className="min-h-screen bg-[#fff09e] dark:bg-white bg-opacity-30 border pb-16">
      <div className="flex justify-center ">
        <div className="w-full py-10 px-5 flex flex-col gap-8">
          <div className="w-full flex flex-row justify-between gap-5 border bg-white rounded-lg p-5 shadow-xl">
            <div>
              <h1 className="px-5 text-4xl font-semibold">$8,185</h1>
              <LineChart
                width={500}
                height={300}
                data={data}
                className="mt-5"
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#942873" strokeWidth={2} dot={false} />
              </LineChart>
            </div>
            <div className="w-1/3 flex flex-col justify-between">
              <div>
                <p className="text-2xl font-semibold">Total Deposits</p>
                <p className=" opacity-50 mt-3">Total amount deposited this month by all the users</p>
                <div className="flex flex-col mt-2 opacity-80 ">
                  <p>Pending Deposits: 40</p>
                  <p>Rejected Deposits: 100</p>
                  <p>Desposited Charge: $500</p>
                </div>
              </div>
              <Button className="bg-primary text-white dark:text-white dark:hover:bg-hover dark:bg-primary hover:bg-hover mb-6">View Deposits</Button>
            </div>
          </div>
          <div className="w-full flex flex-row bg-white justify-between gap-5 border rounded-lg p-5 shadow-xl">
            <div>
              <h1 className="px-5 text-4xl font-semibold">$5,395</h1>
              <LineChart
                width={500}
                height={300}
                data={data}
                className="mt-5"
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#942873" strokeWidth={2} dot={false} />
              </LineChart>
            </div>
            <div className="w-1/3 flex flex-col justify-between">
              <div>
                <p className="text-2xl font-semibold">Total Withdrawals</p>
                <p className=" opacity-50 mt-3">Total amount withdrawed this month by all the users</p>
                <div className="flex flex-col mt-2 opacity-80 ">
                  <p>Pending Withdrawals: <span className="font-medium">32</span></p>
                  <p>Rejected Withdrawals: <span className="font-medium">130</span></p>
                  <p>Withdrawal Charge: <span className="font-medium">$142</span></p>
                </div>
              </div>
              <Button className="bg-primary text-white dark:text-white dark:hover:bg-hover dark:bg-primary hover:bg-hover mb-6">View Withdrawals</Button>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-3 pt-10 pr-5">
          <SolidCard title="Total Users" data={1000} bgStyle="bg-[#FAD79C]" titleStyle="text-[#D29125]" dataStyle="text-[#D29125]" />
          <SolidCard title="Active Users" data={"2k+"} bgStyle="bg-white  border-2 border-[#fad79c]" titleStyle="text-[#D29125]" dataStyle="text-[#D29125]" />
          <SolidCard title="Mobile Unverified Users" data={350} bgStyle="bg-[#FAD79C]" titleStyle="text-[#D29125]" dataStyle="text-[#D29125]" />
          <SolidCard title="Email Unverifed Users" data={500} bgStyle="bg-white border-2 border-[#fad79c]" titleStyle="text-[#D29125]" dataStyle="text-[#D29125]" />
        </div>
      </div>
    </div>
  );
};

export default Home;
