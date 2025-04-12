import { useState } from 'react';

function Roadmap() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);

  const toggleDayCompletion = (week, day) => {
    const dayKey = `week${week}day${day}`;
    if (completedDays.includes(dayKey)) {
      setCompletedDays(completedDays.filter(d => d !== dayKey));
    } else {
      setCompletedDays([...completedDays, dayKey]);
    }
  };

  const curriculum = [
    {
      week: 1,
      title: "Foundation – Linux, Git, Shell, AWS Core",
      days: [
        {
          day: 1,
          title: "Linux Basics",
          tasks: [
            "Ubuntu Commands Guide",
            "GNU File Permissions",
            "SSH Guide - DigitalOcean"
          ]
        },
        {
          day: 2,
          title: "Shell Scripting + Cron",
          tasks: [
            "Bash Scripting Tutorial - GNU",
            "Crontab Syntax Guide"
          ]
        },
        {
          day: 3,
          title: "Git & GitHub",
          tasks: [
            "Git Official Docs",
            "GitHub Docs",
            "Git Branching"
          ]
        },
        {
          day: 4,
          title: "AWS IAM + S3",
          tasks: [
            "IAM User Guide",
            "Amazon S3 Docs"
          ]
        },
        {
          day: 5,
          title: "AWS EC2 + Security Groups",
          tasks: [
            "Amazon EC2 Docs",
            "Security Groups"
          ]
        },
        {
          day: 6,
          title: "VPC + Elastic IP",
          tasks: [
            "VPC Overview",
            "Elastic IP"
          ]
        },
        {
          day: 7,
          title: "Review + Mini Project",
          tasks: [
            "Script to auto-deploy files to S3",
            "Launch EC2 → install Apache/nginx → host site"
          ]
        }
      ]
    },
    {
      week: 2,
      title: "Docker + CI/CD + AWS Deployments",
      days: [
        {
          day: 8,
          title: "Docker Basics",
          tasks: [
            "Docker Docs",
            "Dockerfile Reference"
          ]
        },
        {
          day: 9,
          title: "Docker Compose",
          tasks: [
            "Docker Compose Docs",
            "DockerHub Docs"
          ]
        },
        {
          day: 10,
          title: "GitHub Actions (CI/CD)",
          tasks: [
            "GitHub Actions Docs"
          ]
        },
        {
          day: 11,
          title: "Jenkins Pipeline",
          tasks: [
            "Jenkins Docs",
            "Pipeline Syntax"
          ]
        },
        {
          day: 12,
          title: "AWS RDS + Load Balancer",
          tasks: [
            "Amazon RDS Docs",
            "Elastic Load Balancer Docs"
          ]
        },
        {
          day: 13,
          title: "Route 53 + SSL",
          tasks: [
            "Amazon Route 53 Docs",
            "ACM (SSL Certificates)"
          ]
        },
        {
          day: 14,
          title: "Project Deployment",
          tasks: [
            "Deploy full app via GitHub Actions to EC2 behind ELB",
            "Use RDS as backend + S3 for media storage"
          ]
        }
      ]
    },
    {
      week: 3,
      title: "Terraform + Kubernetes + Monitoring",
      days: [
        {
          day: 15,
          title: "Terraform Basics",
          tasks: [
            "Terraform Official Docs",
            "AWS Provider for Terraform"
          ]
        },
        {
          day: 16,
          title: "Terraform: VPC + RDS + Security Group",
          tasks: [
            "Automate full infra with .tf files"
          ]
        },
        {
          day: 17,
          title: "Kubernetes Basics",
          tasks: [
            "Kubernetes Docs",
            "kubectl Cheat Sheet"
          ]
        },
        {
          day: 18,
          title: "K8s Ingress + Volumes",
          tasks: [
            "Kubernetes Ingress Docs"
          ]
        },
        {
          day: 19,
          title: "CI/CD to Kubernetes",
          tasks: [
            "GitHub Actions pipeline to deploy to K8s cluster",
            "Use Docker + kubectl CLI"
          ]
        },
        {
          day: 20,
          title: "Monitoring: CloudWatch + Prometheus + Grafana",
          tasks: [
            "Prometheus Docs",
            "Grafana Docs",
            "AWS CloudWatch Docs"
          ]
        },
        {
          day: 21,
          title: "Review + Mini Project",
          tasks: [
            "End-to-end microservice app deployed on K8s",
            "Infra with Terraform + monitoring enabled"
          ]
        }
      ]
    },
    {
      week: 4,
      title: "Final Projects + Resume + Interview Prep",
      days: [
        {
          day: 22,
          title: "Serverless (Lambda + API Gateway)",
          tasks: [
            "AWS Lambda Docs",
            "API Gateway Docs",
            "DynamoDB Docs"
          ]
        },
        {
          day: 23,
          title: "Secrets + SSM + Logs",
          tasks: [
            "AWS Systems Manager (SSM)",
            "Secrets Manager",
            "CloudWatch Logs"
          ]
        },
        {
          day: 24,
          title: "Resume / LinkedIn / GitHub Setup",
          tasks: [
            "DevOps Resume Guide",
            "Push projects with clear README.md files"
          ]
        },
        {
          day: 25,
          title: "Mock Interview Questions: Linux, Docker, AWS",
          tasks: [
            "Practice 20 common DevOps/Linux questions"
          ]
        },
        {
          day: 26,
          title: "Mock Interview Questions: Terraform, K8s, CI/CD",
          tasks: [
            "Practice 20 advanced questions"
          ]
        },
        {
          day: 27,
          title: "Final Capstone Project",
          tasks: [
            "Use All Tools: Docker + GitHub Actions CI/CD",
            "Terraform infra (EC2, RDS, S3, VPC)",
            "Kubernetes deployment",
            "Monitoring + Logging"
          ]
        },
        {
          day: 28,
          title: "Polish + Share + Apply",
          tasks: [
            "Final review",
            "Polish all projects on GitHub",
            "Apply for 10+ DevOps/Cloud jobs or internships"
          ]
        }
      ]
    }
  ];

  const currentWeekData = curriculum.find(w => w.week === currentWeek);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DevOps Learning Tracker</h1>
          <p className="text-gray-600">1-Month Intensive DevOps + AWS Cloud Study Plan</p>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          {curriculum.map(week => (
            <button
              key={week.week}
              onClick={() => setCurrentWeek(week.week)}
              className={`px-4 py-2 rounded-lg ${currentWeek === week.week ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}
            >
              Week {week.week}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-blue-700 text-white">
            <h2 className="text-2xl font-bold">Week {currentWeekData.week}: {currentWeekData.title}</h2>
            <p className="opacity-90 mt-1">
              {completedDays.filter(d => d.startsWith(`week${currentWeek}`)).length}/{currentWeekData.days.length} days completed
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {currentWeekData.days.map(day => {
              const dayKey = `week${currentWeek}day${day.day}`;
              const isCompleted = completedDays.includes(dayKey);
              
              return (
                <div key={day.day} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Day {day.day}: {day.title}
                    </h3>
                    <button
                      onClick={() => toggleDayCompletion(currentWeek, day.day)}
                      className={`px-3 py-1 rounded-md text-sm ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                  
                  <ul className="space-y-2">
                    {day.tasks.map((task, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-5 h-5 mt-0.5 mr-2 border border-gray-300 rounded-sm flex-shrink-0"></span>
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {curriculum.map(week => {
              const weekDays = week.days.length;
              const completedWeekDays = completedDays.filter(d => d.startsWith(`week${week.week}`)).length;
              const percentage = Math.round((completedWeekDays / weekDays) * 100);
              
              return (
                <div key={week.week} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Week {week.week}</span>
                    <span className="text-sm text-gray-500">{completedWeekDays}/{weekDays}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;