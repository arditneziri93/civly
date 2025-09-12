"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { EditorSidebarRight } from "@/app/(main)/editor/editor-sidebar/editor-sidebar-right";
import { useEffect, useState } from "react";
import { useCvStore } from "@/app/(main)/editor/cv_store";
import { CvData } from "@/schemas/cv_data_schema";

export default function Page() {
  return (
    <SidebarProvider isWide={true} className="overflow-hidden h-[100vh]">
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 overflow-scroll">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="min-h-[100vh] gap-4 p-4 overflow-y-auto">
          <TemplatePreview id="dummy" />
        </div>
      </SidebarInset>
      <EditorSidebarRight />
    </SidebarProvider>
  );
}

const TemplatePreview = ({ id }: { id: string }) => {
  const getSingle = useCvStore((s) => s.getSingle);
  const [cvData, setCvData] = useState<CvData | null>(null);
  const subscribe = useCvStore.subscribe;

  useEffect(() => {
    let alive = true;
    subscribe((state) => {
      console.log("CV STORE CHANGED", state);
      setCvData(state.items.find((x) => x.id === id) as CvData);
    });
    (async () => {
      const data = await getSingle(id);
      if (!alive) return;
      setCvData(data as CvData);
    })();
    return () => {
      alive = false;
    };
  }, [getSingle, subscribe]);
  return (
    <div className=" mx-auto min-h-[1000px] w-full max-w-3xl rounded-xl bg-gray-200 p-20">
      <h1 className="text-2xl font-bold">{cvData?.name.toString()}</h1>
      <br />
      <h2 className="text-xl font-bold">Personal Information</h2>
      <br />
      <div
        className="
        grid items-start gap-x-4 gap-y-4
        sm:grid-cols-[6rem_minmax(0,1fr)]
        sm:[&>*:nth-child(odd)]:block
        sm:[&>*:nth-child(odd)]:w-full
        sm:[&>*:nth-child(odd)]:text-right"
      >
        <span className="font-bold text-gray-600">Name</span>
        <p>
          {cvData?.personalInformation.name +
            " " +
            cvData?.personalInformation.surname}
        </p>
        <span className="font-bold text-gray-600">Profile URL</span>
        <p>{cvData?.personalInformation.profileUrl}</p>
        <span className="font-bold text-gray-600">Email</span>
        <p>{cvData?.personalInformation.email}</p>
        <span className="font-bold text-gray-600">Phone</span>
        <p>{cvData?.personalInformation.phone}</p>
        <span className="font-bold text-gray-600">Location</span>
        <p>{cvData?.personalInformation.location}</p>
        <span className="font-bold text-gray-600">LinkedIn</span>
        <p>{cvData?.personalInformation.linkedin}</p>
        <span className="font-bold text-gray-600">Xing</span>
        <p>{cvData?.personalInformation.xing}</p>
        <span className="font-bold text-gray-600">Website</span>
        <p>{cvData?.personalInformation.website}</p>
        <span className="font-bold text-gray-600">Title</span>
        <p>{cvData?.personalInformation.professionalTitle}</p>
        <span className="font-bold text-gray-600">Birthdate</span>
        <p>{cvData?.personalInformation.birthdate}</p>
        <span className="font-bold text-gray-600">Summary</span>
        <p>{cvData?.personalInformation.summary}</p>
      </div>
      <br />
      <br />

      <h2 className="text-xl font-bold">Skills</h2>
      <br />
      <div className="flex flex-cols-2 gap-16">
        {cvData?.skillGroups.map((skillGroup, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <p className="font-bold">{skillGroup.name}</p>
            <div>
              {skillGroup.skills.map((skill, index) => (
                <p key={index}>{skill.name}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />

      <h2 className="text-xl font-bold">Experience</h2>
      <br />

      <div className="flex flex-col gap-2">
        {cvData?.experience.map((experience, index) => (
          <div key={index} className="flex flex-col gap-1 mb-2">
            <p className="font-bold">{experience.role}</p>
            <p key={index + "-company"}>{experience.company}</p>
            <p key={index + "-startDate"}>{experience.startDate}</p>
            <p key={index + "-endDate"}>{experience.endDate}</p>
            <p key={index + "-location"}>{experience.location}</p>
            <p key={index + "-description"}>{experience.description}</p>
          </div>
        ))}
      </div>
      <br />
      <br />

      <h2 className="text-xl font-bold">Education</h2>
      <br />
      <div className="flex flex-col gap-2">
        {cvData?.education.map((education, index) => (
          <div key={index} className="flex flex-col gap-1 mb-2">
            <p className="font-bold">{education.degree}</p>
            <p key={index + "-institution"}>{education.institution}</p>
            <p key={index + "-startDate"}>{education.startDate}</p>
            <p key={index + "-endDate"}>{education.endDate}</p>
            <p key={index + "-location"}>{education.location}</p>
            <p key={index + "-description"}>{education.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
